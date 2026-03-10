import { useState, useCallback, useEffect, useRef } from 'react';
import useAuth from './useAuth';
import useMessage from './useMessage';
import { createOrUpdateRating, getBookRatingsPaginated } from '../services/ratingService';
import { sendFeedback } from '../utils/feedbackHelper';

const PAGE_SIZE = 5;

const mapRating = (r) => ({
  name: r.userName,
  date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : 'N/A',
  rating: r.value,
  comment: r.comment,
});

/**
 * Custom hook that independently fetches & manages paginated ratings for a book.
 * Does NOT depend on the book-detail payload — calls the dedicated ratings endpoint.
 * Accepts optional initialStats (averageRating, totalReviews) from the book detail
 * response to avoid a flash of "0" while the first page is loading.
 */
const useBookReviews = (bookId, initialStats = null) => {
  const { user, isAuthenticated } = useAuth();
  const message = useMessage();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(initialStats?.averageRating ?? 0);
  const [totalReviews, setTotalReviews] = useState(initialStats?.totalReviews ?? 0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sync initial stats from book detail (avoids flash of 0)
  useEffect(() => {
    if (initialStats) {
      setAvgRating(initialStats.averageRating ?? 0);
      setTotalReviews(initialStats.totalReviews ?? 0);
    }
  }, [initialStats]);

  const nextPageRef = useRef(0);

  // Fetch a page of ratings and append (or replace) the list
  const fetchPage = useCallback(async (page, replace = false) => {
    if (!bookId) return;
    try {
      setLoadingMore(true);
      const data = await getBookRatingsPaginated(bookId, page, PAGE_SIZE);
      const mapped = (data.ratings || []).map(mapRating);

      setReviews((prev) => (replace ? mapped : [...prev, ...mapped]));
      setTotalReviews(data.total ?? 0);
      setHasMore(data.hasMore ?? false);
      nextPageRef.current = page + 1;
    } catch (err) {
      console.error('Failed to fetch ratings:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [bookId]);

  // Initial fetch when bookId changes
  useEffect(() => {
    if (!bookId) return;
    nextPageRef.current = 0;
    setReviews([]);
    fetchPage(0, true);
  }, [bookId, fetchPage]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPage(nextPageRef.current);
    }
  }, [loadingMore, hasMore, fetchPage]);

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

      // Reset to first page so the new review appears at the top
      nextPageRef.current = 0;
      await fetchPage(0, true);

      message.success('Cảm ơn bạn đã gửi đánh giá!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      message.error('Gửi đánh giá thất bại. Vui lòng thử lại.');
    }
  }, [isAuthenticated, user?.userId, bookId, message, fetchPage]);

  return { reviews, avgRating, totalReviews, hasMore, loadingMore, loadMore, handleReviewSubmit };
};

export default useBookReviews;
