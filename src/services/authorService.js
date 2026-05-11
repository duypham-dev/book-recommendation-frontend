import api from '../config/ApiConfig.js';

export const getAuthors = async () => {
    const response = await api.get('/authors');
    return response.data || response || [];
};

export const getAuthorById = async (authorId) => {
    const response = await api.get(`/authors/${authorId}`);
    return response.data || response;
};

export const createAuthor = async (authorData) => {
    const response = await api.post('/admin/authors/create', authorData);
    return response.data || response;
};

export const updateAuthor = async (authorId, authorData) => {
    const response = await api.put(`/admin/authors/update/${authorId}`, authorData);
    return response.data || response;
};

export const deleteAuthor = async (authorId) => {
    const response = await api.delete(`/admin/authors/delete/${authorId}`);
    return response.data || response;
};
