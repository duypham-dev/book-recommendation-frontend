import api from "../config/ApiConfig.js";

export const getUser = async (page = 0, size = 10, keyword = "", status = "", sort = "") => {
    const params = { page, size };
    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }
    if (status?.trim()) {
      params.status = status.trim();
    }
    if (sort?.trim()) {
      params.sort = sort.trim();
    }

    const response = await api.get("/admin/users", { params });
    return response;
};

export const banUser = async (userId) => {
    return await api.patch(`/users/${userId}/ban`);
};

export const unbanUser = async (userId) => {
    return await api.patch(`/users/${userId}/unban`);
};

export const banUsersBulk = async (userIds = []) => {
    return await api.patch("/users/ban", { ids: userIds });
};