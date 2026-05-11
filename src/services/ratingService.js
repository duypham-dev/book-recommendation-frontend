import api from '../config/ApiConfig.js';

/**
 * Create or update a rating for a book.
 * @param {string} bookId 
 * @param {{ value: number, comment: string }} ratingData
 * @returns {Promise<any>}
 */
export const createOrUpdateRating = async (bookId, ratingData) => {
    const response = await api.post(`/books/${bookId}/ratings`, ratingData);
    return response.data || response;
};

/**
 * Get all ratings for a book
 * @param {string} userId Pass '0' to get ALL ratings of the book
 * @param {string} bookId
 * @returns {Promise<any>}
 */
export const getBookRatings = async (userId, bookId) => {
    const response = await api.get(`books/${bookId}/ratings`);
    return response.data || response || [];
};

/**
 * Delete a rating for a book.
 * @param {string} userId
 * @param {string} bookId
 * @returns {Promise<any>}
 */
export const deleteRating = async (userId, bookId) => {
    const response = await api.delete(`/users/${userId}/books/${bookId}/ratings`);
    return response.data || response;
};

/**
 * Get the average rating for a book.
 * @param {string} bookId
 * @returns {Promise<{averageRating: number, totalRatings: number}>}
 */
export const getAverageRatingByBookId = async (userId, bookId) => {
    const response = await api.get(`/books/${bookId}/average-rating`);
    return response.data || response;
};

/**
 * Get user's own rating for a book
 * @param {string} userId
 * @param {string} bookId
 * @returns {Promise<any>}
 */
export const getUserRating = async (userId, bookId) => {
    const ratings = await getBookRatings(userId, bookId);
    // If userId is specific, return the first (and only) rating
    return ratings.length > 0 ? ratings[0] : null;
};

/**
 * Get paginated ratings for a book (public endpoint, no userId needed).
 * @param {string} bookId
 * @param {number} page  - 0-based page index
 * @param {number} size  - number of ratings per page
 * @returns {Promise<{ ratings: Array, total: number, hasMore: boolean, page: number, size: number }>}
 */
export const getBookRatingsPaginated = async (bookId, page = 0, size = 5) => {
    const response = await api.get(`/books/${bookId}/ratings`, {
        params: { page, size },
    });
    return response.data?.data ?? response.data ?? { ratings: [], total: 0, hasMore: false };
};