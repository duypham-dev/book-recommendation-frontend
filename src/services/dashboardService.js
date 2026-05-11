import api from "../config/ApiConfig.js";

/**
 * Fetch admin dashboard data.
 */
export const getDashboardStats = async () => {
    return await api.get("/admin/dashboard/stats");
};

/**
 * 
 * @param {{params: Object}} params
 * @returns {{ data: Object|null, message: string }}
 */
export const getTopRatedBooks = async (params = {}) => {
  const response = await api.get("/admin/dashboard/top-rated-books", {
    params,
  });
  return response;
};

/**
 * 
 * @param {{params: Object}} params
 * @returns {{ data: Object|null, message: string }
 * }
 */
export const getTopFavoritedBooks = async (params = {}) => {
    const response = await api.get("/admin/dashboard/top-favorited-books", {
      params,
    });
    return response;
};

/**
 * 
 * @param {{time: number}} time 
 * @returns {{ data: Object|null, message: string }}
 */
export const getNewUsers = async (time) => {
    return await api.get(`/admin/dashboard/new-users?time=${time}`); 
};