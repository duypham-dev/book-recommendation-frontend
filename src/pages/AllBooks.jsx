import React, { useCallback, useRef, useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowUp, BookOpen } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import BookCard from "../components/common/BookCard";
import { getAllBooks } from "../services/bookService";
const PAGE_SIZE = 12;
const MAGIN_ROOT = "100px";
const SCROLL_THRESHOLD = 0.1;

const AllBooks = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    const shouldShow = window.scrollY > 400;
    if (showScrollTop !== shouldShow) {
      setShowScrollTop(shouldShow);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [showScrollTop]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["allBooks"],
    queryFn: ({ pageParam = 0 }) => getAllBooks(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      console.log("Next page param:", lastPage.nextPage);
      return lastPage.nextPage ? lastPage.nextPage : undefined;
    },
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });

  const observer = useRef();

  const lastBookElementRef = useCallback((node) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    { root: null, rootMargin: MAGIN_ROOT, threshold: SCROLL_THRESHOLD }
);

    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 mt-16 min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tất cả sách
          </h1>
        </div>

        {status === "pending" ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : status === "error" ? (
          <div className="text-center py-20 text-red-500">
            <p className="text-lg font-semibold mb-2">Đã xảy ra lỗi khi tải danh sách!</p>
            <p>{error?.message || "Vui lòng thử lại sau"}</p>
          </div>
        ) : (
          <>
            {data?.pages?.[0]?.content?.length === 0 ? (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400 text-lg">
                Không tìm thấy cuốn sách nào!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {data?.pages.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page.content.map((book, bookIndex) => {
                      const isLastElement = 
                        pageIndex === data.pages.length - 1 && 
                        bookIndex === page.content.length - 1;
                      return (
                        <div 
                          ref={isLastElement ? lastBookElementRef : null} 
                          key={`${book.bookId || book.id}-${pageIndex}-${bookIndex}`}
                          className="transform transition duration-300 hover:-translate-y-1"
                        >
                          <BookCard book={book} />
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            )}
            
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-8 mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {!hasNextPage && data?.pages?.[0]?.content?.length > 0 && (
              <div className="text-center py-8 mt-4 text-gray-500 dark:text-gray-400">
                Bạn đã xem hết danh sách sách.
              </div>
            )}
          </>
        )}
      </div>

      {/* Nút quay lại đầu trang */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 z-50 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Quay lại đầu trang"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </MainLayout>
  );
};

export default AllBooks;
