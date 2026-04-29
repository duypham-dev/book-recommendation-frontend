import { Pen, Star, Calendar, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { getPreviewBook } from "../../services/bookService";
import { applyPreset, isCloudinaryUrl } from "../../utils/cloudinaryUtils";
import { generateSlug } from "../../utils/generateSlug";

const TOOLTIP_WIDTH = 320;
const TOOLTIP_DEFAULT_HEIGHT = 280;
const GAP = 12;
const MARGIN = 8;
const HOVER_DELAY_MS = 200;

const calcTooltipPosition = (triggerRect, tooltipWidth = TOOLTIP_WIDTH, tooltipHeight = TOOLTIP_DEFAULT_HEIGHT) => {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let left;
  let arrowSide = "left";

  if (triggerRect.right + GAP + tooltipWidth + MARGIN <= viewportW) {
    left = triggerRect.right + GAP;
  } else if (triggerRect.left - GAP - tooltipWidth >= MARGIN) {
    left = triggerRect.left - GAP - tooltipWidth;
    arrowSide = "right";
  } else {
    left = Math.min(triggerRect.right + GAP, viewportW - tooltipWidth - MARGIN);
  }

  let top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
  top = Math.max(MARGIN, Math.min(top, viewportH - tooltipHeight - MARGIN));

  return { left, top, arrowSide };
};

const BookCard = ({ book, className = "", preview = true }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [previewBook, setPreviewBook] = useState({});
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0, arrowSide: "left" });
  
  const bookUrl = `/books/${generateSlug(book.title)}-${book.bookId}`;

  const cardRef = useRef(null);
  const tooltipRef = useRef(null);
  const hoverTimer = useRef(null);
  const isHovering = useRef(false);
  const previewCacheRef = useRef({});

  const dismiss = useCallback(() => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    isHovering.current = false;
    setShowTooltip(false);
  }, []);

  const updateTooltipPosition = useCallback(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;
    const tooltipH = tooltipEl ? tooltipEl.offsetHeight : TOOLTIP_DEFAULT_HEIGHT;
    setTooltipPos(calcTooltipPosition(rect, TOOLTIP_WIDTH, tooltipH));
  }, []);

  const fetchPreviewBook = useCallback(async (bookId) => {
    if (!bookId) return;

    const cached = previewCacheRef.current[bookId];
    if (cached) {
      if (!isHovering.current) return;
      setPreviewBook(cached);
      setShowTooltip(true);
      updateTooltipPosition();
      return;
    }

    try {
      const data = await getPreviewBook(bookId);
      previewCacheRef.current[bookId] = data;
      if (!isHovering.current) return;
      setPreviewBook(data);
      setShowTooltip(true);
      updateTooltipPosition();
    } catch (error) {
      console.error("Failed to fetch book preview:", error);
    }
  }, [updateTooltipPosition]);

  // Dismiss on scroll (any scrollable ancestor) and window blur
  useEffect(() => {
    if (!showTooltip) return;

    const handleScroll = () => dismiss();
    const handleBlur = () => dismiss();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", dismiss);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", dismiss);
    };
  }, [showTooltip, dismiss]);

  // Re-measure after tooltip renders (to get correct height)
  useEffect(() => {
    if (showTooltip) updateTooltipPosition();
  }, [showTooltip, previewBook, updateTooltipPosition]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimer.current);
      isHovering.current = false;
    };
  }, []);

  const handleMouseEnter = preview
    ? () => {
        isHovering.current = true;
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setTooltipPos(calcTooltipPosition(rect));
        clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => fetchPreviewBook(book.bookId), HOVER_DELAY_MS);
      }
    : undefined;

  const handleMouseLeave = preview ? () => dismiss() : undefined;

  const handleClick = () => {
    dismiss();
    navigate(bookUrl);
  };

  const optimizedCoverUrl =
    book.coverImageUrl && isCloudinaryUrl(book.coverImageUrl)
      ? applyPreset(book.coverImageUrl, "bookCard")
      : book.coverImageUrl;

  return (
    <div
      ref={cardRef}
      className={`w-full cursor-pointer relative ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105 group">
        <img
          src={optimizedCoverUrl || "/placeholder.svg"}
          alt={book.title}
          className="w-full aspect-[3/4] object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="mt-2 sm:mt-3 font-semibold text-gray-800 dark:text-white line-clamp-2 text-xs sm:text-sm">
        {book.title}
      </h3>
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-300 mt-0.5 sm:mt-1 flex gap-1.5 sm:gap-2 items-center">
        <Pen size={12} className="flex-shrink-0 sm:w-3.5 sm:h-3.5" />
        <span className="truncate">
          {book.authors?.map((a) => a.authorName).join(", ") || "-"}
        </span>
      </p>

      {preview &&
        showTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[9999] w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 pointer-events-none animate-fadeIn"
            style={{ left: tooltipPos.left, top: tooltipPos.top }}
          >
            {tooltipPos.arrowSide === "left" && (
              <div className="absolute right-full top-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white dark:border-r-gray-800" />
            )}
            {tooltipPos.arrowSide === "right" && (
              <div className="absolute left-full top-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white dark:border-l-gray-800" />
            )}

            <div className="flex gap-4">
              <img
                src={
                  previewBook.coverImageUrl &&
                  isCloudinaryUrl(previewBook.coverImageUrl)
                    ? applyPreset(previewBook.coverImageUrl, "bookThumbnail")
                    : previewBook.coverImageUrl || "/placeholder.svg"
                }
                alt={previewBook.title}
                className="w-24 h-32 object-cover rounded-lg shadow-md flex-shrink-0"
                loading="lazy"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                  {previewBook.title}
                </h4>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <Pen
                      size={12}
                      className="flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400"
                    />
                    <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
                      {previewBook.authors
                        ?.map((a) => a.authorName)
                        .join(", ") || "Không rõ tác giả"}
                    </span>
                  </div>

                  {previewBook.averageRating !== undefined && (
                    <div className="flex items-center gap-2">
                      <Star
                        size={12}
                        className="flex-shrink-0 text-yellow-400 fill-yellow-400"
                      />
                      <span className="text-gray-600 dark:text-gray-300">
                        {previewBook.averageRating.toFixed(1)} (
                        {previewBook.totalReviews || 0} đánh giá)
                      </span>
                    </div>
                  )}

                  {previewBook.genres?.length > 0 && (
                    <div className="flex items-start gap-2">
                      <BookOpen
                        size={12}
                        className="flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400"
                      />
                      <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
                        {previewBook.genres
                          .map((g) => g.genreName)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {previewBook.publicationYear && (
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={12}
                        className="flex-shrink-0 text-gray-500 dark:text-gray-400"
                      />
                      <span className="text-gray-600 dark:text-gray-300">
                        Năm xuất bản: {previewBook.publicationYear}
                      </span>
                    </div>
                  )}
                </div>

                {previewBook.description && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {previewBook.description}
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default BookCard;
