import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import useAuth from "../../hooks/useAuth";
import useBookReaderData from "../../hooks/useBookReaderData";
import useEpubTheme from "../../hooks/useEpubTheme";
import useReadingProgress from "../../hooks/useReadingProgress";
import useBookmarks from "../../hooks/useBookmarks";
import useEpubReader from "../../hooks/useEpubReader";
import { sendFeedback } from "../../utils/feedbackHelper";

import ReaderHeader from "./ReaderHeader";
import ReaderControls from "./ReaderControls";
import SidePanel from "./SidePanel";

export default function EpubCoreViewer({ onBack }) {
  const { bookId } = useParams();
  const { user } = useAuth();
  const userId = user?.userId;

  const { book, bookUrl, isLoading: dataLoading, error: dataError } = useBookReaderData(bookId);

  const renditionRef = useRef(null); // single shared ref for both hooks
  const { registerThemes, applyCurrentTheme } = useEpubTheme(renditionRef);
  const { syncProgress, computeProgress } = useReadingProgress(userId, bookId);

  const {
    bookmarks,
    toggleBookmark,
    renameBookmark,
    removeBookmark,
    isBookmarked,
  } = useBookmarks(userId, bookId);

  const {
    viewerRef,
    isLoading: epubLoading,
    error: epubError,
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
  } = useEpubReader(bookUrl, {
    renditionRef,
    userId,
    bookId,
    bookTitle: book?.title,
    registerThemes,
    applyCurrentTheme,
    syncProgress,
    computeProgress,
  });

  // Bug 1 fixed: renditionRef is now shared directly with useEpubReader — no sync effect needed.

  // Send feedback to recommendation system on first load
  const feedbackSentRef = useRef(false);
  useEffect(() => {
    if (userId && bookId && bookUrl && !feedbackSentRef.current) {
      feedbackSentRef.current = true;
      sendFeedback(userId, bookId, "history");
    }
  }, [userId, bookId, bookUrl]);

  const isLoading = dataLoading || epubLoading;
  const error = dataError || epubError;

  // --- Side panel state ---
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState("toc");
  const [editingBmId, setEditingBmId] = useState(null);

  const openPanel = useCallback((tab = "toc") => {
    setPanelTab(tab);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  const handleGoBack = useCallback(() => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    window.history.back();
  }, [onBack]);

  const handleToggleBookmark = useCallback(() => {
    toggleBookmark(currentCfi, { chapterTitle, page });
  }, [toggleBookmark, currentCfi, chapterTitle, page]);

  const handleGoToTocOrBookmark = useCallback(
    (item) => goTo(item.cfi || item.href),
    [goTo],
  );

  const handleGoBookmark = useCallback(
    (bm) => goTo(bm.cfi),
    [goTo],
  );

  const bookmarked = isBookmarked(currentCfi);

  return (
    <div className="relative h-screen select-none bg-white dark:bg-gray-800">
      <ReaderHeader
        title={meta.title}
        page={page}
        totalPages={totalPages}
        isBookmarked={bookmarked}
        onBack={handleGoBack}
        onToggleBookmark={handleToggleBookmark}
        onOpenPanel={openPanel}
        onJumpToPage={jumpToPage}
      />

      <div className="absolute top-18 bottom-10 left-0 right-0 shadow-lg max-w-[1280px] mx-auto">
        <div className="relative w-full h-full">

          {/* The viewer div where the ePub will be rendered */}
          <div ref={viewerRef} className="absolute inset-0" />

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 text-white">
              <div className="h-8 w-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              <div className="text-sm">Đang tải, vui lòng đợi…</div>
            </div>
          )}

          {error && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-md text-center rounded-lg bg-white/90 p-4 text-red-600">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>

      <ReaderControls
        page={page}
        totalPages={totalPages}
        onPrev={goPrev}
        onNext={goNext}
      />

      <AnimatePresence>
        {panelOpen && (
          <SidePanel
            onClose={closePanel}
            tab={panelTab}
            setTab={setPanelTab}
            toc={toc}
            currentHref={currentHref}
            goTo={handleGoToTocOrBookmark}
            bookmarks={bookmarks}
            onGoBookmark={handleGoBookmark}
            editingBmId={editingBmId}
            setEditingBmId={setEditingBmId}
            renameBookmark={renameBookmark}
            removeBookmark={removeBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
