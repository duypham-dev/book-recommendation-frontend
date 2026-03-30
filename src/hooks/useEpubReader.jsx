import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ePub from "epubjs";

const POS_STORAGE_PREFIX = "reader:cfi";

function buildPosKey(userId, bookId) {
  const prefix = userId ? `reader:user:${userId}` : "reader:guest";
  return bookId != null ? `${prefix}:cfi:${bookId}` : `${prefix}:${POS_STORAGE_PREFIX}`;
}

function getTotalLocations(book) {
  const loc = book?.locations;
  if (!loc) return 0;
  if (typeof loc.length === "function") return loc.length();
  if (typeof loc.length === "number") return loc.length;
  return 0;
}

const useEpubReader = (src, { userId, bookId, bookTitle, registerThemes, applyCurrentTheme, syncProgress, computeProgress }) => {
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const bookRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ title: bookTitle || "", author: "" });
  const [toc, setToc] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [currentCfi, setCurrentCfi] = useState(null);
  const [currentHref, setCurrentHref] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");

  const posKey = useMemo(() => buildPosKey(userId, bookId), [userId, bookId]);

  useEffect(() => {
    const saved = localStorage.getItem(posKey);
    setCurrentCfi(saved || null);
  }, [posKey]);

  const tocByHref = useMemo(() => {
    const map = {};
    const walk = (items = []) => {
      for (const it of items) {
        if (it.href) map[it.href.split("#")[0]] = it;
        if (it.subitems?.length) walk(it.subitems);
      }
    };
    walk(toc);
    return map;
  }, [toc]);

  const saveCfi = useCallback(
    (cfi) => {
      if (!cfi) return;
      setCurrentCfi(cfi);
      try {
        localStorage.setItem(posKey, cfi);
      } catch {
        // Storage full or unavailable
      }
    },
    [posKey],
  );

  // --- Epub initialization ---
  useEffect(() => {
    const container = viewerRef.current;
    if (!container || !src) {
      if (!src && container) {
        setError("Không tìm thấy nguồn sách để đọc.");
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError("");

    const epubBook = ePub(src);
    bookRef.current = epubBook;

    const rendition = epubBook.renderTo(container, {
      width: "100%",
      height: "100%",
      flow: "paginated",
      manager: "default",
    });
    renditionRef.current = rendition;

    registerThemes(rendition);
    applyCurrentTheme(rendition);

    rendition.on("rendered", () => applyCurrentTheme(rendition));

    let destroyed = false;

    (async () => {
      try {
        await epubBook.ready;
        await epubBook.locations.generate(1024);

        const { title, creator } = epubBook.package?.metadata || {};
        setMeta({ title: title || bookTitle || "", author: creator || "" });

        const nav = await epubBook.loaded.navigation;
        setToc(nav?.toc || []);

        const total = getTotalLocations(epubBook);
        setTotalPages(total);

        const savedCfi = localStorage.getItem(posKey);
        await rendition.display(savedCfi || undefined);

        if (epubBook.locations?.locationFromCfi) {
          try {
            const idx = savedCfi
              ? epubBook.locations.locationFromCfi(savedCfi)
              : 0;
            if (typeof idx === "number" && Number.isFinite(idx)) {
              setPage(idx + 1);
              syncProgress(total > 0 ? computeProgress(idx, total) : 0, true);
            } else {
              syncProgress(0, true);
            }
          } catch {
            syncProgress(0, true);
          }
        } else {
          syncProgress(0, true);
        }

        const hideLoading = () => {
          if (!destroyed) setIsLoading(false);
          rendition.off("rendered", hideLoading);
        };
        rendition.on("rendered", hideLoading);
      } catch {
        if (!destroyed) {
          setError("Không tải được sách. Vui lòng kiểm tra đường dẫn hoặc CORS.");
          setIsLoading(false);
        }
      }
    })();

    const onRelocated = (loc) => {
      const cfi = loc?.start?.cfi;
      if (cfi) saveCfi(cfi);

      let locationIndex = null;
      const locations = bookRef.current?.locations;
      if (cfi && locations?.locationFromCfi) {
        try {
          const idx = locations.locationFromCfi(cfi);
          if (typeof idx === "number" && Number.isFinite(idx)) {
            locationIndex = idx;
            setPage(idx + 1);
          }
        } catch {
          // Ignore location resolution errors
        }
      }

      const total = getTotalLocations(bookRef.current);
      if (total > 0 && locationIndex !== null) {
        syncProgress(computeProgress(locationIndex, total));
      }

      const href = loc?.start?.href?.split("#")[0] || "";
      setCurrentHref(href);
    };

    rendition.on("relocated", onRelocated);

    const onKey = (e) => {
      if (e.key === "ArrowLeft") renditionRef.current?.prev();
      if (e.key === "ArrowRight") renditionRef.current?.next();
    };
    window.addEventListener("keydown", onKey);

    const onResize = () => renditionRef.current?.resize("100%", "100%");
    window.addEventListener("resize", onResize);

    return () => {
      destroyed = true;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      rendition.off("relocated", onRelocated);
      renditionRef.current = null;
      bookRef.current = null;
      try {
        epubBook.destroy();
      } catch {
        // Ignore destroy errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, bookId]);

  // Derive chapterTitle from currentHref
  useEffect(() => {
    const item = tocByHref[currentHref];
    setChapterTitle(item?.label || "");
  }, [currentHref, tocByHref]);

  const goPrev = useCallback(() => renditionRef.current?.prev(), []);
  const goNext = useCallback(() => renditionRef.current?.next(), []);
  const goTo = useCallback((target) => renditionRef.current?.display(target), []);

  const jumpToPage = useCallback(
    (pageNumber) => {
      const p = Math.max(1, Math.min(pageNumber, totalPages || 1));
      try {
        const cfi = bookRef.current?.locations?.cfiFromLocation(p - 1);
        if (cfi) goTo(cfi);
      } catch {
        // Ignore jump errors
      }
    },
    [totalPages, goTo],
  );

  return {
    viewerRef,
    renditionRef,
    isLoading,
    error,
    meta,
    toc,
    totalPages,
    page,
    currentCfi,
    currentHref,
    chapterTitle,
    goPrev,
    goNext,
    goTo,
    jumpToPage,
  };
};

export default useEpubReader;
