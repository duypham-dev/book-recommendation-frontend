/**
 * Recommendation Service
 *
 * Tất cả các API call liên quan đến hệ thống gợi ý sách.
 * - User-facing: gọi qua Node backend (đã xác thực).
 * - Admin-facing: gọi qua Node backend proxy → RS (FastAPI).
 *
 * KHÔNG gọi thẳng RS từ frontend để đảm bảo bảo mật.
 */

import api from '../config/ApiConfig.js';

// ─────────────────────────────────────────────
// Helper: Trích xuất data từ response chuẩn { success, data, message }
// ─────────────────────────────────────────────
const getApiData = (response) => response?.data?.data ?? response?.data;

// ═════════════════════════════════════════════
// USER-FACING APIs
// ═════════════════════════════════════════════

/**
 * Lấy danh sách sách gợi ý cho user đang đăng nhập.
 * Yêu cầu xác thực JWT.
 * @param {number} limit - Số lượng gợi ý tối đa (mặc định 10)
 */
export const getRecommendations = async (limit = 10) => {
  const response = await api.get('/recommendations', { params: { limit } });
  return getApiData(response);
};

/**
 * Lấy danh sách sách tương tự (dựa trên SBERT cosine similarity).
 * @param {number} bookId - ID của sách gốc
 * @param {number} limit - Số lượng kết quả tối đa (mặc định 10)
 */
export const getSimilarBooks = async (bookId, limit = 10) => {
  const response = await api.get('/similar-books', { params: { bookId, limit } });
  return getApiData(response);
};

// ═════════════════════════════════════════════
// ADMIN APIs — Health & Model Info
// ═════════════════════════════════════════════

/**
 * Kiểm tra trạng thái RS (model đã load chưa, đang retrain không).
 */
export const getHealthStatus = async () => {
  const response = await api.get('/admin/recommendation/health');
  return getApiData(response);
};

/**
 * Lấy thông tin chi tiết model đang chạy.
 * Trả về: ALS params (users, items, factors, ...) + SBERT params (books, profiles, dim).
 */
export const getModelInfo = async () => {
  const response = await api.get('/admin/recommendation/model-info');
  return getApiData(response);
};

// ═════════════════════════════════════════════
// ADMIN APIs — Retrain
// ═════════════════════════════════════════════

/**
 * Trigger full retrain cả ALS + SBERT (chạy background ở RS).
 * Lưu ý: Quá trình retrain có thể mất 2–5 phút.
 */
export const triggerRetrain = async () => {
  const response = await api.post('/admin/recommendation/retrain');
  return getApiData(response);
};

// ═════════════════════════════════════════════
// ADMIN APIs — Online Learning
// ═════════════════════════════════════════════

/**
 * Lấy trạng thái online learning và thông tin buffer hiện tại.
 * Trả về: { enabled, buffer_size, buffer_capacity, buffer_full, note }
 */
export const getOnlineLearningStatus = async () => {
  const response = await api.get('/admin/recommendation/online-learning/status');
  return getApiData(response);
};

/**
 * Bật online learning với kích thước buffer tùy chỉnh.
 * Chỉ cập nhật SBERT profiles, không cập nhật ALS.
 * @param {number} bufferSize - Số tương tác tích lũy trước khi trigger update (10–1000)
 */
export const enableOnlineLearning = async (bufferSize = 100) => {
  const response = await api.post('/admin/recommendation/online-learning/enable', {}, {
    params: { bufferSize },
  });
  return getApiData(response);
};

/**
 * Tắt online learning.
 */
export const disableOnlineLearning = async () => {
  const response = await api.post('/admin/recommendation/online-learning/disable');
  return getApiData(response);
};

/**
 * Trigger cập nhật incremental SBERT profiles từ buffer.
 * @param {boolean} force - Bỏ qua ngưỡng buffer, cập nhật ngay (mặc định false)
 */
export const triggerIncrementalUpdate = async (force = false) => {
  const response = await api.post('/admin/recommendation/online-learning/update', {}, {
    params: { force },
  });
  return getApiData(response);
};

// ═════════════════════════════════════════════
// ADMIN APIs — Cache Management
// ═════════════════════════════════════════════

/**
 * Lấy thống kê số lượng Redis key theo từng loại cache gợi ý.
 * Trả về: { recommendationsCount, similarBooksCount, totalCount }
 */
export const getCacheStats = async () => {
  const response = await api.get('/admin/recommendation/cache/stats');
  return getApiData(response);
};

/**
 * Xóa toàn bộ Redis cache gợi ý sách (recommendations, similar_books).
 */
export const clearRecommendationCache = async () => {
  const response = await api.delete('/admin/recommendation/cache');
  return getApiData(response);
};

// ═════════════════════════════════════════════
// ADMIN APIs — Redis Inspector
// ═════════════════════════════════════════════

/**
 * Lấy chi tiết tất cả recommendation cache keys,
 * phân nhóm theo loại: { recommendations, similarBooks }.
 * Mỗi key bao gồm: key, type, ttlSeconds, valueType, valuePreview.
 */
export const getAllRedisCaches = async () => {
  const response = await api.get('/admin/redis/caches');
  return getApiData(response);
};

/**
 * Lấy giá trị thực tế (đã parse JSON) của một Redis key.
 * @param {string} key - Tên Redis key
 */
export const getRedisKeyValue = async (key) => {
  const response = await api.get('/admin/redis/value', { params: { key } });
  return getApiData(response);
};

export default {
  // User-facing
  getRecommendations,
  getSimilarBooks,
  // Admin - Health & Model
  getHealthStatus,
  getModelInfo,
  // Admin - Retrain
  triggerRetrain,
  // Admin - Online Learning
  getOnlineLearningStatus,
  enableOnlineLearning,
  disableOnlineLearning,
  triggerIncrementalUpdate,
  // Admin - Cache
  getCacheStats,
  clearRecommendationCache,
  // Admin - Redis Inspector
  getAllRedisCaches,
  getRedisKeyValue,
};
