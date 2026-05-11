import React from "react";
import {
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { Select, Tag } from "antd";

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
        <Tag
          closeIcon
          onClose={onClearKeyword}
          color="blue"
          icon={<Search className="w-3 h-3 mr-1 inline" />}
          className="flex items-center px-2 py-1 text-sm rounded-full"
        >
          <span className="max-w-[200px] truncate font-medium">"{keyword}"</span>
        </Tag>
      )}

      {/* Active filter count badge */}
      {activeFilterCount > 0 && (
        <Tag color="purple" className="flex items-center px-2 py-1 text-sm rounded-full">
          <span className="font-medium">{activeFilterCount} bộ lọc</span>
        </Tag>
      )}

      {/* Result count */}
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-auto">
        {totalResults > 0
          ? `${totalResults} kết quả`
          : "Không có kết quả"}
      </span>

      {/* Sort dropdown */}
      <Select
        value={sort}
        onChange={onSortChange}
        options={SORT_OPTIONS}
        className="w-36"
        aria-label="Sắp xếp"
      />

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
