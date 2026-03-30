import { useQuery } from "@tanstack/react-query";
import { getBookDetail } from "../services/manageBookService";
import { getBookReadUrl } from "../services/bookService";
import useAuth from "./useAuth";

const useBookReaderData = (bookId) => {
  const { user } = useAuth();

  const bookQuery = useQuery({
    queryKey: ["readerBookDetail", bookId, user?.userId],
    queryFn: () => getBookDetail(bookId, user?.userId),
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const readUrlQuery = useQuery({
    queryKey: ["bookReadUrl", bookId],
    queryFn: () => getBookReadUrl(bookId, "EPUB"),
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    book: bookQuery.data ?? null,
    bookUrl: readUrlQuery.data?.url ?? "",
    isLoading: bookQuery.isLoading || readUrlQuery.isLoading,
    error:
      bookQuery.error?.message || readUrlQuery.error?.message || null,
  };
};

export default useBookReaderData;
