import api from "../config/ApiConfig.js";

export const fetchBookmarks = async (userId, bookId) => {
    const response = await api.get(`/users/${userId}/books/${bookId}/bookmarks`);
    return response.data || response || [];
};

export const createBookmark = async (userId, bookId, payload) => {
    const response = await api.post(`/users/${userId}/books/${bookId}/bookmarks`, payload);
    return response.data || response;
};

export const updateBookmark = async (userId, bookmarkId, payload) => {
    const response = await api.put(`/users/${userId}/bookmarks/${bookmarkId}`, payload);
    return response.data || response;
};

export const deleteBookmark = async (userId, bookmarkId) => {
    return await api.delete(`/users/${userId}/bookmarks/${bookmarkId}`);
};
