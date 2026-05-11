import api from "../config/ApiConfig.js";

export const getUserHistory = async (userId, { page = 0, size = 8 } = {}) => {
    const response = await api.get(`/users/history`, {
      params: { page, size },
    });
    // Handle response - API returns { success, message, data }
    const pageData = response.data || response || null;
    return {
      history: pageData?.content || [],
      page: pageData,
      message: response.message,
    };
};

export const recordReadingHistory = async (userId, bookId, payload) => {
    const response = await api.post(`/users/books/${bookId}/history`, payload);
    return response.data || response;
};

/**
 * Fetch the saved reading progress for a specific book.
 * Returns a number 0–100 (progress percentage).
 */
export const getBookProgressById = async (bookId) => {
  try {
    const response = await api.get(`/users/books/${bookId}/progress`);
    const data = response.data || response;
    return typeof data?.progress === "number" ? data.progress : 0;
  } catch {
    return 0;
  }
};

/** @deprecated Use getBookProgressById for a specific book. */
export const getBookProgress = async (userId, bookId) => {
  return getBookProgressById(bookId);
};
