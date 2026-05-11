import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useMessage from "./useMessage";
import { getBookDetail } from "../services/manageBookService";
import { getBookDownloadUrl } from "../services/bookService";

/**
 * Custom hook that manages book detail data fetching and derived state.
 * Returns the normalized book object, raw bookData, loading state, and action handlers.
 */
const useBookDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const message = useMessage();

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract bookId from slugWithId
  const splitted = id.split('-');
  const bookId = splitted.pop(); 
  // Fetch book detail (includes ratings, isFav, averageRating from backend)
  useEffect(() => {
    if (!bookId) return;

    let cancelled = false;
    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        const response = await getBookDetail(bookId, user?.userId);
        if (!cancelled) setBookData(response);
      } catch (error) {
        console.error("Failed to fetch book detail:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBookDetail();
    return () => {
      cancelled = true;
    };
  }, [bookId, user?.userId]);

  // Normalize bookData into a clean book object
  const book = useMemo(() => {
    if (!bookData) return null;
    return {
      id: bookData.bookId,
      title: bookData.title || "Không có tiêu đề",
      category:
        bookData.genres?.map((g) => g.genreName).join(", ") || "Chưa phân loại",
      authors:
        bookData.authors?.map((a) => a.authorName).join(", ") ||
        "Không rõ tác giả",
      publisher: bookData.publisher || "Không rõ NXB",
      publishDate: bookData.publicationYear || "Không rõ",
      cover: bookData.coverImageUrl || "https://via.placeholder.com/300x400",
      description: bookData.description || "Chưa có mô tả",
    };
  }, [bookData]);

  // Read handler
  const handleRead = useCallback(async () => {
    const bookId = Number(book?.id);
    if (!Number.isFinite(bookId)) {
      message.warning("Không xác định được sách");
      return;
    }
    // Check if user is authenticated before allowing to read
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để đọc sách");
      return;
    }

    navigate(`/reader/${bookId}`);
  }, [book?.id, message, navigate, isAuthenticated]);

  // Download handler
  const handleDownload = useCallback(async () => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tải sách");
      return;
    }

    const bookId = Number(book?.id);
    if (!Number.isFinite(bookId)) {
      message.error("Không xác định được sách để tải xuống");
      return;
    }

    const formats = bookData?.formats || [];
    const preferredPdf = formats.find(
      (f) => f.typeName?.toUpperCase() === "PDF",
    );
    const availableFormat = preferredPdf || formats[0];

    if (!availableFormat?.formatId) {
      message.warning("Không tìm thấy định dạng phù hợp để tải xuống");
      return;
    }

    try {
      const result = await getBookDownloadUrl(bookId, availableFormat.formatId);
      if (!result?.url) {
        message.error("Không thể tạo đường dẫn tải xuống");
        return;
      }

      const anchor = document.createElement("a");
      anchor.href = result.url;
      anchor.download = result.fileName || "book";
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      message.success("Bắt đầu tải xuống sách");
    } catch {
      message.error("Tải xuống thất bại. Vui lòng thử lại.");
    }
  }, [book?.id, bookData?.formats, isAuthenticated, message]);

  return { book, bookData, loading, handleRead, handleDownload };
};

export default useBookDetail;
