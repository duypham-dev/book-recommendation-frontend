import api from "../config/ApiConfig.js";

export const getUserProfile = async () => {
    const response = await api.get(`/users/profile`);
    return response.data || response;
};

export const updateUserProfile = async (userId, profileData) => {
    const payload = {
      username: profileData.username,
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      avatarUrl: profileData.avatarUrl,
    };

    const response = await api.put(`/users/profile`, payload);
    return response.data || response;
};

export const updateUserAvatar = async (userId, file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.patch(`/users/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data || response;
};

export const changeUserPassword = async (userId, passwordData) => {
    const response = await api.patch(`/users/change-password`, passwordData);
    return response.data || response;
};
