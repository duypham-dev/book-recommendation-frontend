import React, { useState, useCallback, useEffect } from "react";
import { History, Loader2 } from "lucide-react";
import EmptyState from "../../components/account/EmptyState";
import BookCard from "../../components/common/BookCard";
import Pagination from "../../components/admin/Pagination";
import { getUserHistory } from "../../services/historyService";
import useAuth from "../../hooks/useAuth";

const PAGE_SIZE = 8;

const EMPTY_PAGINATION = {
  number: 0,
  size: PAGE_SIZE,
  totalPages: 0,
  totalElements: 0,
};

/**
 * Format timestamp to Vietnamese locale string.
 */
const formatLastReadTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleString("vi-VN", { hour12: false });
  } catch {
    return "";
  }
};

/**
 * Skeleton card placeholder while data is loading.
 */
const BookCardSkeleton = () => (
  <div className="flex flex-col items-center animate-pulse w-full max-w-[100px] sm:max-w-[180px]">
    <div className="w-full">
      <div className="w-full h-32 sm:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="mt-1.5 sm:mt-3 h-2.5 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
      <div className="mt-1 sm:mt-2 h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
    </div>
    <div className="mt-1 sm:mt-2 h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-14 sm:w-24" />
  </div>
);

const HistorySection = React.memo(() => {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?.userId;

  const fetchHistory = useCallback(
    async (pageIndex = 0) => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const { history, page } = await getUserHistory(userId, {
          page: pageIndex,
          size: PAGE_SIZE,
        });

        setHistoryItems(history);
        setPagination(
          page
            ? {
                number: page.number ?? pageIndex,
                size: page.size ?? PAGE_SIZE,
                totalPages: page.totalPages ?? 0,
                totalElements: page.totalElements ?? history.length,
              }
            : {
                number: pageIndex,
                size: PAGE_SIZE,
                totalPages: history.length > 0 ? 1 : 0,
                totalElements: history.length,
              },
        );
      } catch (err) {
        console.error("Failed to load reading history:", err);
        setError(err);
        setHistoryItems([]);
        setPagination(EMPTY_PAGINATION);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHistory(0);
  }, [fetchHistory]);

  const handlePageChange = useCallback(
    (pageNumber) => {
      if (!pagination.totalPages) return;
      if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
      fetchHistory(pageNumber - 1);
    },
    [fetchHistory, pagination.totalPages],
  );

  const hasHistory = historyItems.length > 0;
  const showPagination = pagination.totalPages > 1;

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">LỊCH SỬ ĐỌC SÁCH</h2>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          Không thể tải lịch sử đọc. Vui lòng thử lại sau.
        </div>
      )}

      {loading ? (
        <div className="grid gap-2 sm:gap-4 md:gap-6 xl:gap-8 grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : !hasHistory ? (
        <EmptyState icon={History} message="Chưa có lịch sử đọc sách" />
      ) : (
        <>
          <div className="grid gap-2 sm:gap-4 md:gap-6 xl:gap-8 grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
            {historyItems.map((item) => {
              const progressValue = typeof item.progress === "number" ? Math.round(item.progress) : null;
              // Ensure book object always has bookId for BookCard tooltip
              const book = item.book
                ? { ...item.book, bookId: item.book.bookId || item.book.id || item.bookId }
                : {
                    bookId: item.bookId,
                    id: item.bookId,
                    title: "Sách",
                    coverImageUrl: "",
                    authors: [],
                  };
                  

              return (
                <div key={item.id ?? item.bookId ?? `${book.bookId}-${item.lastReadAt}`} className="flex flex-col items-center w-full">
                  <div className="relative w-full">
                    <BookCard book={book} preview={false} />
                    {progressValue !== null && (
                      <span className="absolute left-1 top-1 sm:left-2 sm:top-2 rounded-full bg-blue-600/90 px-1.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-semibold text-white shadow">
                        Đọc {progressValue}%
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 text-center line-clamp-2">
                    Cập nhật: {formatLastReadTime(item.lastReadAt) || "Chưa có dữ liệu"}
                  </p>
                </div>
              );
            })}
          </div>

          {showPagination && (
            <Pagination
              currentPage={pagination.number + 1}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
});

HistorySection.displayName = "HistorySection";
export default HistorySection;
