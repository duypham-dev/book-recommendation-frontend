import { useState, useEffect } from 'react';
import { getSameGenreBooks } from '../services/bookService';

/**
 * Fetches books that share at least one genre with the given book,
 * excluding the book itself.
 *
 * @param {string|number|null|undefined} bookId - Source book ID.
 * @param {number} [limit=6]                    - Max number of books to return.
 * @returns {{ books: Array, loading: boolean }}
 */
const useSameGenreBooks = (bookId, limit = 6) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookId) return;

    let cancelled = false;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await getSameGenreBooks(bookId, limit);
        if (!cancelled) setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch same-genre books:', error);
        if (!cancelled) setBooks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBooks();
    return () => { cancelled = true; };
  }, [bookId, limit]);

  return { books, loading };
};

export default useSameGenreBooks;
