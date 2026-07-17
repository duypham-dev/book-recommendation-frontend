import api from "../config/ApiConfig.js";

// Fetch stored document and webhook configuration from backend
export const getWebhookDoc = async () => {
    const response = await api.get(`/webhook-doc`);
    return response.data || response;
};

// Update document and webhook configuration on backend
export const updateWebhookDoc = async (payload) => {
    const response = await api.post(`/webhook-doc`, payload);
    return response.data || response;
};

// Manually trigger the webhook request from backend
export const triggerManualWebhook = async () => {
    const response = await api.post(`/webhook-doc/trigger`);
    return response.data || response;
};
