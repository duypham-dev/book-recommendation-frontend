import api from "../config/ApiConfig.js";

export const getUserProfile = async () => {
  try {
    const response = await api.get(`/users/profile`);
    return response.data || response;
  } catch (error) {
    console.error("Get user profile failed:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const payload = {
      username: profileData.username,
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      avatarUrl: profileData.avatarUrl,
    };

    const response = await api.put(`/users/profile`, payload);
    return response.data || response;
  } catch (error) {
    console.error("Update profile failed:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserAvatar = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.patch(`/users/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data || response;
  } catch (error) {
    console.error("Update avatar failed:", error.response?.data || error.message);
    throw error;
  }
};

export const changeUserPassword = async (userId, passwordData) => {
  try {
    const response = await api.patch(`/users/change-password`, passwordData);
    return response.data || response;
  } catch (error) {
    console.error("Change password failed:", error.response?.data || error.message);
    throw error;
  }
};
