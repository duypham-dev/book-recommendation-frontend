import { useState, useCallback } from "react";
import useAuth from "./useAuth";
import useMessage from "./useMessage";
import { addFavorite, removeFavorite } from "../services/favoriteService";
import { sendFeedback } from "../utils/feedbackHelper";

/**
 * Custom hook that manages the favorite toggle state for a book.
 * Accepts the initial isFav from the backend book detail payload.
 */
const useFavorite = (bookId, initialIsFav = false) => {
  console.log(
    "Rendering useFavorite for bookId:",
    bookId,
    "initialIsFav:",
    initialIsFav,
  );
  const { user, isAuthenticated } = useAuth();
  const message = useMessage();

  const [isFavorited, setIsFavorited] = useState(initialIsFav);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // Sync when backend data arrives (re-mount or bookId changes)
  // Using a ref-based approach avoids needing a useEffect for this
  const syncFavorite = useCallback((serverIsFav) => {
    setIsFavorited(serverIsFav);
  }, []);

  const handleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    if (loadingFavorite) return;

    const numericBookId = Number(bookId);
    if (!numericBookId || !user?.userId) {
      message.error("Không thể cập nhật yêu thích cho sách này");
      return;
    }

    setLoadingFavorite(true);
    try {
      if (isFavorited) {
        await removeFavorite(user.userId, numericBookId);
        setIsFavorited(false);
        message.success("Đã xóa khỏi yêu thích");
        sendFeedback(user.userId, numericBookId, "favorite", 0);
      } else {
        await addFavorite(user.userId, numericBookId);
        setIsFavorited(true);
        message.success("Đã thêm vào yêu thích");
        sendFeedback(user.userId, numericBookId, "favorite");
      }
    } catch (error) {
      console.error("Favorite action failed:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoadingFavorite(false);
    }
  }, [
    bookId,
    isFavorited,
    isAuthenticated,
    user?.userId,
    loadingFavorite,
    message,
  ]);

  return { isFavorited, loadingFavorite, handleFavorite, syncFavorite };
};

export default useFavorite;
