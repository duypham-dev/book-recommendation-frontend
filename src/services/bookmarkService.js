import api from "../config/ApiConfig.js";

export const fetchBookmarks = async (bookId) => {
    const response = await api.get(`/books/${bookId}/bookmarks`);
    return response.data || response || [];
};

export const createBookmark = async (bookId, payload) => {
    const response = await api.post(`/books/${bookId}/bookmarks`, payload);
    return response.data || response;
};

export const updateBookmark = async (bookmarkId, payload) => {
    const response = await api.put(`/bookmarks/${bookmarkId}`, payload);
    return response.data || response;
};

export const deleteBookmark = async (bookmarkId) => {
    return await api.delete(`/bookmarks/${bookmarkId}`);
};
