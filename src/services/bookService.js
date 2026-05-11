import api from "../config/ApiConfig.js";

export const getRecommendedBooks = async (limit = 10) => {
    const response = await api.get('/recommendations', {
      params: { limit }
    });
    return response.data || response;
};

export const getSimilarBooks = async (bookId, limit = 10) => {
    const response = await api.get('/similar-books', {
      params: { bookId, limit }
    });
    return response;
};

export const getDiversityBooks = async (bookId, { limit = 5 } = {}) => {
    const response = await api.get('/diversity-books', {
      params: { bookId, limit }
    });
    return response;
};

export const getBookDetail = async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data || response;
};

/**
 * Get most read books (top books by reading history count)
 * @param {number} page - Page number (0-based)
 * @param {number} size - Number of books per page
 * @returns {Promise} Response with most read books
 */
export const getMostReadBooks = async (page = 0, size = 5, signal) => {
    const response = await api.get('/books/most-read', {
      params: { page, size },
      signal
    });
    return response.data;
};

export const getPreviewBook = async (bookId) => {
    const response = await api.get(`/books/${bookId}/preview`);
    return response.data || response;
};

/**
 * Get all books with offset-based pagination, search, sort, and filter.
 *
 * @param {Object}   options
 * @param {number}   options.page      - Zero-based page index
 * @param {number}   options.size      - Items per page
 * @param {string}   options.sort      - 'newest' | 'title-asc' | 'title-desc'
 * @param {string}   options.keyword   - Search term
 * @param {number[]} options.genreIds  - Genre ID filter list
 * @param {number[]} options.authorIds - Author ID filter list
 * @param {AbortSignal} signal         - Optional abort signal
 * @returns {{ content: Array, pagination: { page, size, total, totalPages } }}
 */
export const getAllBooks = async ({ page = 0, size = 12, sort, keyword, genreIds, authorIds } = {}, signal) => {
  const params = { page, size };
  if (sort) params.sort = sort;
  if (keyword?.trim()) params.keyword = keyword.trim();
  if (genreIds?.length) params.genreIds = genreIds.join(',');
  if (authorIds?.length) params.authorIds = authorIds.join(',');

  const response = await api.get('/books', { params, signal });
  const data = response.data || response;

  return {
    content: data.content || [],
    pagination: {
      page: data.page ?? 0,
      size: data.size ?? size,
      total: data.total ?? 0,
      totalPages: data.totalPages ?? 0,
    },
  };
};

/**
 * Get a presigned URL for reading a book (EPUB/PDF).
 * @param {number|string} bookId
 * @param {string} format - Preferred format: "EPUB" | "PDF"
 * @returns {Promise<{ url: string, typeName: string, expiresIn: number }>}
 */
export const getBookReadUrl = async (bookId, format = 'EPUB') => {
  const response = await api.get(`/books/${bookId}/read-url`, {
    params: { format },
  });
  return response.data || response;
};

/**
 * Get a presigned download URL for a specific book format.
 * @param {number|string} bookId
 * @param {number|string} formatId
 * @returns {Promise<{ url: string, fileName: string, typeName: string, expiresIn: number }>}
 */
export const getBookDownloadUrl = async (bookId, formatId) => {
  const response = await api.get(`/books/${bookId}/download/${formatId}`);
  return response.data || response;
};

/**
 * Fetch a capped list of non-deleted books sharing at least one genre with
 * the given book, excluding the book itself, ordered newest-first.
 *
 * @param {string|number} bookId - Source book whose genres are matched.
 * @param {number}        limit  - Max results to return (default 6, backend caps at 20).
 * @returns {Promise<Array>} Array of book list items shaped by toBookListResponse.
 */
export const getSameGenreBooks = async (bookId, limit = 6) => {
  const response = await api.get(`/books/${bookId}/same-genre`, {
    params: { limit },
  });
  return response.data || response;
};
