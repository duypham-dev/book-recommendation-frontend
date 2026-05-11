import api from '../config/ApiConfig.js';

export const getBookFavorites = async (userId, { page = 0, size = 12 } = {}) => {
    const response = await api.get(`/users/favorites`, {
        params: { page, size },
    });
    return response.data || response || {};
};

export const addFavorite = async (userId, bookId) => {
    const response = await api.post(`/users/favorites/${bookId}`);
    return response.data || response;
};

export const removeFavorite = async (userId, bookId) => {
    const response = await api.delete(`/users/favorites/${bookId}`);
    return response.data || response;
};

export const isFavorite = async (userId, bookId) => {
    const favorites = await getBookFavorites(userId);
    return favorites.some(fav => 
        String(fav.bookId) === String(bookId) || 
        String(fav.book?.id) === String(bookId)
    );
};