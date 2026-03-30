import React, { useState, useCallback } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useThemeContext } from "../../hooks/useTheme";

const ReaderHeader = ({
  title,
  page,
  totalPages,
  isBookmarked,
  onBack,
  onToggleBookmark,
  onOpenPanel,
  onJumpToPage,
}) => {
  const { theme, setTheme } = useThemeContext();
  const [pageInput, setPageInput] = useState(String(page || 1));

  const resolvedTheme =
    theme === "dark"
      ? "dark"
      : theme === "light"
        ? "light"
        : document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";

  const handlePageInputChange = useCallback((e) => {
    setPageInput(e.target.value.replace(/\D/g, ""));
  }, []);

  const handleJump = useCallback(
    (e) => {
      e.preventDefault();
      const p = Math.max(1, Math.min(Number(pageInput || 1), totalPages || 1));
      onJumpToPage(p);
    },
    [pageInput, totalPages, onJumpToPage],
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  // Sync pageInput when page prop changes
  React.useEffect(() => {
    setPageInput(String(page || 1));
  }, [page]);

  return (
    <div className="fixed top-0 inset-x-0 z-20 h-14 bg-[#29292B] dark:bg-gray-600 text-gray-100 backdrop-blur flex items-center px-3">
      <button
        onClick={onBack}
        className="mr-2 px-2 py-1 rounded hover:bg-white/10"
        title="Quay lại"
      >
        ←
      </button>

      <form onSubmit={handleJump} className="flex items-center gap-2">
        <span className="hidden sm:inline">Trang</span>
        <input
          value={pageInput}
          onChange={handlePageInputChange}
          className="w-14 text-center rounded bg-black/30 border border-white/10 outline-none"
        />
        <span>/{totalPages || "–"}</span>
      </form>

      <div className="absolute inset-x-0 text-center pointer-events-none">
        <div className="font-semibold">{title || "—"}</div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded hover:bg-white/10"
          title="Chế độ tối/sáng"
        >
          {resolvedTheme === "dark" ? "🌙" : "☀️"}
        </button>

        <button
          onClick={onToggleBookmark}
          onContextMenu={(e) => {
            e.preventDefault();
            onOpenPanel("bm");
          }}
          className="px-2 py-1 rounded hover:bg-white/10"
          title={
            isBookmarked
              ? "Bỏ dấu trang tại vị trí này"
              : "Thêm dấu trang tại vị trí này"
          }
        >
          {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
        </button>

        <button
          onClick={() => onOpenPanel("toc")}
          className="px-2 py-1 rounded hover:bg-white/10"
          title="Mục lục"
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default React.memo(ReaderHeader);
