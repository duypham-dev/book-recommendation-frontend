import { useState, useCallback } from 'react';
import useAuth from './useAuth';
import useMessage from './useMessage';
import { createOrUpdateRating, getBookRatings } from '../services/ratingService';
import { sendFeedback } from '../utils/feedbackHelper';

/**
 * Custom hook that manages reviews/ratings state for a book.
 * Accepts initial data from the backend book detail payload to avoid extra API calls.
 */
const useBookReviews = (bookId) => {
    console.log("Rendering useBookReviews for bookId:", bookId);
  const { user, isAuthenticated } = useAuth();
  const message = useMessage();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Derive state from raw ratings array (called once when bookData arrives)
  const syncReviews = useCallback((ratings) => {
    const mapped = (ratings || []).map(r => ({
      name: r.userName,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : 'N/A',
      rating: r.value,
      comment: r.comment,
    }));

    const avg = mapped.length > 0
      ? mapped.reduce((sum, r) => sum + r.rating, 0) / mapped.length
      : 0;

    setReviews(mapped);
    setAvgRating(avg);
    setTotalReviews(mapped.length);
  }, []);

  const handleReviewSubmit = useCallback(async (reviewData) => {
    if (!isAuthenticated || !user?.userId) {
      message.warning('Vui lòng đăng nhập để thực hiện đánh giá.');
      return;
    }

    if (!bookId) {
      message.error('Không tìm thấy thông tin sách để đánh giá.');
      return;
    }

    try {
      const { rating, comment } = reviewData;

      await createOrUpdateRating(user.userId, bookId, { value: rating, comment });
      sendFeedback(user.userId, bookId, 'rating', rating);

      // Refresh all reviews after submitting
      const allReviews = await getBookRatings('0', bookId);
      const mapped = (allReviews || []).map(r => ({
        name: r.userName,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : 'N/A',
        rating: r.value,
        comment: r.comment,
      }));

      const avg = mapped.length > 0
        ? mapped.reduce((sum, r) => sum + r.rating, 0) / mapped.length
        : 0;

      setReviews(mapped);
      setAvgRating(avg);
      setTotalReviews(mapped.length);

      message.success('Cảm ơn bạn đã gửi đánh giá!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      message.error('Gửi đánh giá thất bại. Vui lòng thử lại.');
    }
  }, [isAuthenticated, user?.userId, bookId, message]);

  return { reviews, avgRating, totalReviews, syncReviews, handleReviewSubmit };
};

export default useBookReviews;
