import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import useGenres from "../../hooks/useGenres";
import { getAuthors } from "../../services/authorService";

const MAX_VISIBLE_ITEMS = 6;

/**
 * Collapsible checkbox group with optional search input.
 */
const CheckboxGroup = ({
  title,
  items,
  selectedIds,
  onToggle,
  searchable = false,
  idKey = "id",
  labelKey = "name",
}) => {
  const [expanded, setExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter((item) =>
      String(item[labelKey]).toLowerCase().includes(lower)
    );
  }, [items, searchTerm, labelKey]);

  const visible = showAll ? filtered : filtered.slice(0, MAX_VISIBLE_ITEMS);
  const hasMore = filtered.length > MAX_VISIBLE_ITEMS;

  return (
    <div className="mb-5">
      {/* Section header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <span className="flex items-center gap-2">
          {title}
          {selectedIds.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
              {selectedIds.length}
            </span>
          )}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <>
          {/* Search input */}
          {searchable && (
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>
          )}

          {/* Checkbox list */}
          <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {visible.map((item) => {
              const id = item[idKey];
              const isChecked = selectedIds.includes(id);
              return (
                <label
                  key={id}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-all duration-150 ${
                    isChecked
                      ? "bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(id)}
                    className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500/40 cursor-pointer accent-blue-600"
                  />
                  <span className="truncate">{item[labelKey]}</span>
                </label>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 italic py-2 text-center">
                Không tìm thấy
              </p>
            )}
          </div>

          {/* Show more / less toggle */}
          {hasMore && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showAll
                ? "Thu gọn"
                : `Xem thêm (${filtered.length - MAX_VISIBLE_ITEMS})`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Inline filter sidebar for the AllBooks page.
 * Always visible on desktop as a sticky sidebar beside the book grid.
 * On mobile, it's hidden behind a toggle button.
 */
const FilterSidePanel = ({
  selectedGenreIds = [],
  onGenreToggle,
  selectedAuthorIds = [],
  onAuthorToggle,
  onClearAll,
}) => {
  const { genres } = useGenres();
  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);

  // Fetch authors on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setAuthorsLoading(true);
      try {
        const data = await getAuthors();
        if (!cancelled) setAuthors(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setAuthors([]);
      } finally {
        if (!cancelled) setAuthorsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Map genres to uniform shape { id, name }
  const genreItems = useMemo(
    () =>
      (genres || []).map((g) => ({
        id: g.genreId ?? g.genre_id ?? g.id,
        name: g.genreName ?? g.genre_name ?? g.name,
      })),
    [genres]
  );

  // Map authors to uniform shape { id, name }
  const authorItems = useMemo(
    () =>
      (authors || []).map((a) => ({
        id: a.id ?? a.authorId ?? a.author_id,
        name: a.name ?? a.authorName ?? a.author_name,
      })),
    [authors]
  );

  const totalActive = selectedGenreIds.length + selectedAuthorIds.length;

  return (
    <aside className="w-full sticky top-24 h-fit max-h-[calc(100vh-7rem)]">
      <div className="bg-white dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-7rem)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
            Bộ lọc
            {totalActive > 0 && (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
                {totalActive}
              </span>
            )}
          </h3>
          {totalActive > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
              aria-label="Xóa tất cả bộ lọc"
            >
              <RotateCcw className="w-3 h-3" />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
          <CheckboxGroup
            title="Thể loại"
            items={genreItems}
            selectedIds={selectedGenreIds}
            onToggle={onGenreToggle}
            idKey="id"
            labelKey="name"
          />

          <CheckboxGroup
            title="Tác giả"
            items={authorItems}
            selectedIds={selectedAuthorIds}
            onToggle={onAuthorToggle}
            searchable
            idKey="id"
            labelKey="name"
          />

          {authorsLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidePanel;
