import React from "react";
import {
  LayoutGrid,
  List,
  X,
  Search,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "title-asc", label: "Tên A → Z" },
  { value: "title-desc", label: "Tên Z → A" },
];

/**
 * Horizontal toolbar for AllBooks page.
 * Controls: keyword chip, result count, sort dropdown, view toggle.
 */
const BooksToolbar = ({
  keyword = "",
  onClearKeyword,
  viewMode = "grid",
  onViewModeChange,
  sort = "newest",
  onSortChange,
  activeFilterCount = 0,
  totalResults = 0,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {/* Active keyword chip */}
      {keyword && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-full text-sm text-blue-700 dark:text-blue-300">
          <Search className="w-3.5 h-3.5" />
          <span className="max-w-[200px] truncate font-medium">"{keyword}"</span>
          <button
            onClick={onClearKeyword}
            className="ml-0.5 p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
            aria-label="Xóa từ khóa"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active filter count badge */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-full text-sm text-purple-700 dark:text-purple-300">
          <span className="font-medium">{activeFilterCount} bộ lọc</span>
        </div>
      )}

      {/* Result count */}
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-auto">
        {totalResults > 0
          ? `${totalResults} kết quả`
          : "Không có kết quả"}
      </span>

      {/* Sort dropdown */}
      <select
        id="book-sort-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40 cursor-pointer transition-colors"
        aria-label="Sắp xếp"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* View mode toggle */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded-md transition-all ${
            viewMode === "grid"
              ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded-md transition-all ${
            viewMode === "list"
              ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
          aria-label="List view"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BooksToolbar;
