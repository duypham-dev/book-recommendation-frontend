import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, BookOpen, Search, SlidersHorizontal, X } from "lucide-react";
import { Pagination, Skeleton } from "antd";

import MainLayout from "../layouts/MainLayout";
import BookCard from "../components/common/BookCard";
import BookListItem from "../components/common/BookListItem";
import Breadcrumb from "../components/common/Breadcrumb";
import BooksToolbar from "../components/AllBooks/BooksToolbar";
import FilterSidePanel from "../components/AllBooks/FilterSidePanel";
import { getAllBooks } from "../services/bookService";

const PAGE_SIZE = 12;

// ------------------------------------------------------------------
// Skeleton Loader
// ------------------------------------------------------------------
const BookGridSkeleton = ({ count = PAGE_SIZE, hasSidebar = true }) => (
  <div className={`grid grid-cols-2 sm:grid-cols-3 ${hasSidebar ? "lg:grid-cols-4" : "lg:grid-cols-6"} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <Skeleton.Image active className="w-full aspect-[3/4]" style={{ width: '100%', height: 'auto', aspectRatio: '3/4' }} />
        <Skeleton active title={false} paragraph={{ rows: 2, width: ['80%', '50%'] }} />
      </div>
    ))}
  </div>
);

// ------------------------------------------------------------------
// AllBooks Page
// ------------------------------------------------------------------
const AllBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read keyword from URL
  const keyword = searchParams.get("keyword") || "";

  // Local UI state
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Mobile filter toggle (only affects mobile view)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset page when filters, sort, or keyword change
  useEffect(() => {
    setPage(0);
  }, [keyword, sort, selectedGenreIds, selectedAuthorIds]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Query params object for TanStack Query
  const queryParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      sort,
      keyword,
      genreIds: selectedGenreIds,
      authorIds: selectedAuthorIds,
    }),
    [page, sort, keyword, selectedGenreIds, selectedAuthorIds]
  );

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["allBooks", queryParams],
    queryFn: ({ signal }) => getAllBooks(queryParams, signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const books = data?.content || [];
  const pagination = data?.pagination || { page: 0, size: PAGE_SIZE, total: 0, totalPages: 0 };

  // -- Handlers --

  const handleClearKeyword = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("keyword");
      return next;
    });
  }, [setSearchParams]);

  const handleGenreToggle = useCallback((id) => {
    setSelectedGenreIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }, []);

  const handleAuthorToggle = useCallback((id) => {
    setSelectedAuthorIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSelectedGenreIds([]);
    setSelectedAuthorIds([]);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const activeFilterCount = selectedGenreIds.length + selectedAuthorIds.length;

  // Breadcrumb
  const breadcrumbItems = keyword
    ? [
        { label: "Tất cả sách", href: "/books" },
        { label: `Tìm kiếm: "${keyword}"` },
      ]
    : [{ label: "Tất cả sách" }];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 mt-5 min-h-screen">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Page heading */}
        <div className="flex items-center gap-3 mb-2">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : "Tất cả sách"}
            </h1>
          </div>
        </div>

        {/* Toolbar */}
        <BooksToolbar
          keyword={keyword}
          onClearKeyword={handleClearKeyword}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sort={sort}
          onSortChange={setSort}
          activeFilterCount={activeFilterCount}
          totalResults={pagination.total}
        />

        {/* Mobile filter toggle button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFilterOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border transition-all w-full justify-center ${
              mobileFilterOpen
                ? "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{mobileFilterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Mobile filter panel (collapsible) */}
          {mobileFilterOpen && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <FilterSidePanel
                selectedGenreIds={selectedGenreIds}
                onGenreToggle={handleGenreToggle}
                selectedAuthorIds={selectedAuthorIds}
                onAuthorToggle={handleAuthorToggle}
                onClearAll={handleClearAllFilters}
              />
            </div>
          )}
        </div>

        {/* Main content area: sidebar + book grid */}
        <div className="flex gap-6">
          {/* Desktop filter sidebar — always visible */}
          <div className="hidden lg:block flex-shrink-0 w-64">
            <FilterSidePanel
              selectedGenreIds={selectedGenreIds}
              onGenreToggle={handleGenreToggle}
              selectedAuthorIds={selectedAuthorIds}
              onAuthorToggle={handleAuthorToggle}
              onClearAll={handleClearAllFilters}
            />
          </div>

          {/* Books grid / list */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <BookGridSkeleton />
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                <p className="text-lg font-semibold mb-2">
                  Đã xảy ra lỗi khi tải danh sách!
                </p>
                <p>{error?.message || "Vui lòng thử lại sau"}</p>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Search className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Không tìm thấy cuốn sách nào
                  {keyword && ` phù hợp với "${keyword}"`}
                  {activeFilterCount > 0 && " với bộ lọc hiện tại"}.
                </p>
                {(keyword || activeFilterCount > 0) && (
                  <button
                    onClick={() => {
                      handleClearKeyword();
                      handleClearAllFilters();
                    }}
                    className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Xóa tất cả bộ lọc và từ khóa
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 transition-all">
                {books.map((book) => (
                  <div
                    key={book.bookId}
                    className="transform transition duration-300 hover:-translate-y-1"
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {books.map((book) => (
                  <BookListItem key={book.bookId} book={book} />
                ))}
              </div>
            )}

            {/* Loading overlay for page transitions */}
            {isFetching && !isLoading && (
              <div className="flex justify-center items-center py-4 mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && books.length > 0 && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 pb-4">
                <Pagination
                  current={pagination.page + 1}
                  total={pagination.total}
                  pageSize={PAGE_SIZE}
                  onChange={(page) => setPage(page - 1)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll-to-top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 z-50 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Quay lại đầu trang"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </MainLayout>
  );
};

export default AllBooks;
