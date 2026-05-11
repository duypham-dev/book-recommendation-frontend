import api from "../config/ApiConfig.js";

export const getUser = async () => {
    const response = await api.get("/auth/profile");
    return response.data || response;
};

export const login = async (identifier, password) => {
    const response = await api.post("/auth/login", { identifier, password });
    return response.data || response;
};

export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data || response;
};

export const logout = async () => {
    const response = await api.post("/auth/logout");
    return response.data || response;
};

export const refreshToken = async () => {
    const response = await api.post("/auth/refresh");
    return response.data || response;
};

export const activateAccount = async (token) => {
    const response = await api.post("/auth/activate", { token });
    return response.data || response;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data || response;
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
    const response = await api.post("/auth/reset-password", { token, newPassword, confirmPassword });
    return response.data || response;
};