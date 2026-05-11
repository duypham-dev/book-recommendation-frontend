import api from "../config/ApiConfig.js";
/**
 * Fetch genres with pagination support.
 * @param {{ page?: number, size?: number, keyword?: string, sort?: string }} params
 * @returns {{ genres: Array, page: Object|null, message: string }}
 */
export const getGenres = async ({ page = 0, size = 50, keyword = "", sort = "" } = {}) => {
    const params = { page, size };
    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }
    if (sort?.trim()) {
      params.sort = sort.trim();
    }

    const response = await api.get("/admin/books/genres", { params });

    const pageData = response.data || response || null;
    return {
      genres: pageData?.content || [],
      page: pageData,
      message: response.message,
    };
};

export const getAllGenres = async () => {
    const response = await api.get("/genres");
    return response.data || response || [];
};

/**
 * Fetch a single genre by ID.
 * @param {string|number} genreId
 * @returns {{ genreId: string, genreName: string, description: string|null }}
 */
export const getGenreById = async (genreId) => {
    const response = await api.get(`/genres/${genreId}`);
    return response.data || response;
};

/**
 * Create a new genre
 * @param {{ name: string, description: string }} genreData
 */
export const createGenre = async (genreData) => {
    const response = await api.post("/admin/genres/create", genreData);
    return response.data || response;
};

/**
 * Update an existing genre
 * @param {number} genreId
 * @param {{ name: string, description: string }} genreData
 */
export const updateGenre = async (genreId, genreData) => {
    const response = await api.put(`/admin/genres/update/${genreId}`, genreData);
    return response.data || response;
};

/**
 * Delete a genre
 * @param {number} genreId
 */
export const deleteGenre = async (genreId) => {
    const response = await api.delete(`/admin/genres/delete/${genreId}`);
    return response.data || response;
};
