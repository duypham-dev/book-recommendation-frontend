import api from "../config/ApiConfig.js";

export const getBooks = async (page = 0, size = 10) => {
    const response = await api.get("/books", {
      params: { page, size }
    });
    return response;
};

/**
 * Fetch books by genre with pagination and sorting.
 * @param {string|number} genreId
 * @param {{ page?: number, size?: number, sort?: string }} options
 * @returns {{ content: Array, page: number, size: number, total: number, totalPages: number }}
 */
export const getBooksByGenre = async (genreId, { page = 0, size = 10, sort = '' } = {}) => {
    const params = { page, size };
    if (sort?.trim()) {
      params.sort = sort.trim();
    }
    const response = await api.get(`/books/genre/${genreId}`, { params });
    return response.data || response;
};

export const searchBooks = async (keyword, page = 0, size = 10) => {
    const response = await api.get("/books/search", {
      params: { keyword, page, size }
    });
    return response.data || response;
};

export const getBookDetail = async (bookId, userId = null) => {
    const response = await api.get(`/books/${bookId}`, {
      params: { userId }
    });
    return response.data || response;
};

export const createBook = async (payload) => {
    const response = await api.post("/admin/books/create", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
};

export const updateBook = async (bookId, payload) => {
    const response = await api.put(`/admin/books/update/${bookId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
};

export const deleteBook = async (bookId) => {
    const response = await api.delete(`/admin/books/delete/${bookId}`);
    return response;
};

export const getDeletedBooks = async ({ page = 0, size = 10, keyword = "", sort = "" } = {}) => {
    const params = { page, size };
    if (keyword?.trim()) params.keyword = keyword.trim();
    if (sort?.trim()) params.sort = sort.trim();
    return await api.get("/admin/books/deleted", { params });
};

export const hardDeleteBook = async (bookId) => {
    return await api.delete(`/admin/books/hard-delete/${bookId}`);
};

export const restoreBook = async (bookId) => {
    return await api.patch(`/admin/books/restore/${bookId}`);
};

export const deleteBooksBulk = async (bookIds = []) => {
    return await api.delete("/admin/books", {
      data: { ids: bookIds },
    });
};

export const getAdminBooks = async ({
  page = 0,
  size = 10,
  keyword = "",
  genreId,
  sort = "",
} = {}) => {
    const params = { page, size };
    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }
    if (genreId !== undefined && genreId !== null && genreId !== "") {
      params.genreId = genreId;
    }
    if (sort?.trim()) {
      params.sort = sort.trim();
    }
    return await api.get("/admin/books", { params });
};

export const getBookFormats = async (bookId) => {
    const response = await api.get(`/books/${bookId}/formats`);
    return response.data || response || [];
};
