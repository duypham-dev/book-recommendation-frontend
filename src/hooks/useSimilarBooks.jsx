import { useState, useEffect } from 'react';
import { getSimilarBooks } from '../services/bookService';

export const useSimilarBooks = (bookId, limit = 10) => {
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSimilarBooks = async () => {
      if (!bookId) {
        setSimilarBooks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getSimilarBooks(bookId, limit);
        console.log("Fetched similar books:", data);
        const booksArray = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        if (isMounted) {
          setSimilarBooks(booksArray);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch similar books');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSimilarBooks();

    return () => {
      isMounted = false;
    };
  }, [bookId, limit]);

  return { similarBooks, loading, error };
};

export default useSimilarBooks;
