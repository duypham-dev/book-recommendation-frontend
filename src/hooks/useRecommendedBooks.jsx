import { useState, useEffect } from 'react';
import { getRecommendedBooks } from '../services/bookService';
import useAuth from './useAuth';

export const useRecommendedBooks = (limit = 10) => {
  const { isAuthenticated } = useAuth();
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRecommendedBooks = async () => {
      // Only fetch if authenticated, otherwise return empty array
      if (!isAuthenticated) {
        setRecommendedBooks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getRecommendedBooks(limit);
        // Ensure data is an array
        const booksArray = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        if (isMounted) {
          setRecommendedBooks(booksArray);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch recommendations');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecommendedBooks();

    return () => {
      isMounted = false;
    };
  }, [limit, isAuthenticated]);

  return { recommendedBooks, loading, error };
};

export default useRecommendedBooks;
