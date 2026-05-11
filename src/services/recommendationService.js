import api from '../config/ApiConfig.js';

const fetchActiveModelInfo = async () => {
  try {
    const response = await api.get('/recommendation/active-model');
    const payload = getApiData(response);
    if (payload?.baseUrl) {
      setActiveModelCache(payload);
    }
    lastActiveFetch = Date.now();
    return payload;
  } catch (error) {
    console.warn('[RS API] Failed to fetch active recommendation model:', error.message);
    return null;
  }
};

const ensureActiveModel = async ({ forceRefresh = false } = {}) => {
  const needsRefresh = Date.now() - lastActiveFetch > ACTIVE_MODEL_REFRESH_TTL_MS;
  if (!forceRefresh && activeModelInfo?.baseUrl && !needsRefresh) {
    return activeModelInfo;
  }

  const info = await fetchActiveModelInfo();
  if (info?.baseUrl) {
    return info;
  }

  // Fallback to default if no info available
  setActiveModelCache(activeModelInfo?.baseUrl ? activeModelInfo : DEFAULT_MODEL_INFO);
  return activeModelInfo;
};

const callRecsys = async (method, url, options = {}) => {
  const { forceRefresh = false, ...axiosConfig } = options;
  await ensureActiveModel({ forceRefresh });
  return rsApi.request({ method, url, ...axiosConfig });
};

/**
 * Refresh model registry (admin only)
 * @param {boolean} force - Force refresh even if cache is warm
 * @returns {Promise<{models: Array, activeKey: string}>}
 */
export const refreshModelRegistry = async (force = false) => {
  if (!force && modelOptionsCache.length && Date.now() - lastRegistryFetch < MODEL_REGISTRY_TTL_MS) {
    return {
      models: modelOptionsCache,
      activeKey: activeModelInfo?.key,
    };
  }

  const response = await api.get('/admin/recommendation/models');
  const payload = getApiData(response);
  const models = payload?.models ?? [];
  const activeKey = payload?.activeKey
    ?? models.find((model) => model.active)?.key
    ?? activeModelInfo?.key
    ?? DEFAULT_MODEL_INFO.key;

  setModelOptionsCache(models);
  lastRegistryFetch = Date.now();

  const active = models.find((model) => model.key === activeKey);
  if (active?.baseUrl) {
    setActiveModelCache(active);
  }

  return {
    models,
    activeKey,
  };
};

/**
 * Get model options list (admin only)
 */
export const getAvailableRecommendationModels = async (force = false) => {
  if (!force && modelOptionsCache.length) {
    return modelOptionsCache;
  }
  const { models } = await refreshModelRegistry(true);
  return models;
};

/**
 * Set active recommendation model (admin only)
 */
export const setActiveRecommendationModel = async (modelKey) => {
  const response = await api.put(`/admin/recommendation/models/${modelKey}`);
  const payload = getApiData(response);

  if (payload?.baseUrl) {
    setActiveModelCache(payload);
    setModelOptionsCache(
      modelOptionsCache.map((model) => ({
        ...model,
        active: model.key === payload.key,
      }))
    );
  }

  return payload;
};

/**
 * Get health status of recommendation system (via Java backend proxy)
 */
export const getHealthStatus = async () => {
  try {
    const response = await api.get('/admin/recommendation/health');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to get health status:', error);
    throw error;
  }
};

/**
 * Get model information (via Java backend proxy)
 */
export const getModelInfo = async () => {
  try {
    const response = await api.get('/admin/recommendation/model-info');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to get model info:', error);
    throw error;
  }
};

/**
 * Trigger model retraining (Admin only) - via Java backend proxy
 * This ensures cache invalidation is handled properly
 */
export const triggerRetrain = async () => {
  try {
    const response = await api.post('/admin/recommendation/retrain');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to trigger retrain:', error);
    throw error;
  }
};

/**
 * Get personalized recommendations for a user
 */
export const getRecommendations = async (userId, limit = 10, options = {}) => {
  try {
    const response = await callRecsys('get', '/recommendations', {
      params: { user_id: userId, limit },
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get recommendations:', error);
    throw error;
  }
};

/**
 * Get similar books
 */
export const getSimilarBooks = async (bookId, limit = 10, options = {}) => {
  try {
    const response = await callRecsys('get', '/similar', {
      params: { book_id: bookId, limit },
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get similar books:', error);
    throw error;
  }
};

/**
 * Get online learning status (via Java backend proxy)
 */
export const getOnlineLearningStatus = async () => {
  try {
    const response = await api.get('/admin/recommendation/online-learning/status');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to get online learning status:', error);
    throw error;
  }
};

/**
 * Enable online learning (via Java backend proxy)
 */
export const enableOnlineLearning = async (bufferSize = 100) => {
  try {
    const response = await api.post('/admin/recommendation/online-learning/enable', null, {
      params: { bufferSize },
    });
    return getApiData(response);
  } catch (error) {
    console.error('Failed to enable online learning:', error);
    throw error;
  }
};

/**
 * Disable online learning (via Java backend proxy)
 */
export const disableOnlineLearning = async () => {
  try {
    const response = await api.post('/admin/recommendation/online-learning/disable');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to disable online learning:', error);
    throw error;
  }
};

/**
 * Trigger incremental update (via Java backend proxy)
 */
export const triggerIncrementalUpdate = async (force = false) => {
  try {
    const response = await api.post('/admin/recommendation/online-learning/update', null, {
      params: { force },
    });
    return getApiData(response);
  } catch (error) {
    console.error('Failed to trigger incremental update:', error);
    throw error;
  }
};

/**
 * Get cache statistics (Admin only)
 */
export const getCacheStats = async () => {
  try {
    const response = await api.get('/admin/recommendation/cache/stats');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    throw error;
  }
};

/**
 * Clear all recommendation caches (Admin only)
 */
export const clearRecommendationCache = async () => {
  try {
    const response = await api.delete('/admin/recommendation/cache');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to clear recommendation cache:', error);
    throw error;
  }
};

// ========== Redis Inspector APIs ==========

/**
 * Get Redis cache summary (Admin only)
 */
export const getRedisCacheSummary = async () => {
  try {
    const response = await api.get('/admin/redis/summary');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to get Redis cache summary:', error);
    throw error;
  }
};

/**
 * Get all Redis cache entries with details (Admin only)
 */
export const getAllRedisCaches = async () => {
  try {
    const response = await api.get('/admin/redis/caches');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to get Redis caches:', error);
    throw error;
  }
};

/**
 * Search Redis keys by pattern (Admin only)
 */
export const searchRedisKeys = async (pattern = '*') => {
  try {
    const response = await api.get('/admin/redis/keys', {
      params: { pattern },
    });
    return getApiData(response);
  } catch (error) {
    console.error('Failed to search Redis keys:', error);
    throw error;
  }
};

/**
 * Get detailed info for a specific Redis key (Admin only)
 */
export const getRedisKeyInfo = async (key) => {
  try {
    const response = await api.get('/admin/redis/key', {
      params: { key },
    });
    return getApiData(response);
  } catch (error) {
    console.error('Failed to get Redis key info:', error);
    throw error;
  }
};

/**
 * Get the actual value stored in a Redis key (Admin only)
 */
export const getRedisKeyValue = async (key) => {
  try {
    const response = await api.get('/admin/redis/value', {
      params: { key },
    });
    return getApiData(response);
  } catch (error) {
    console.error('Failed to get Redis key value:', error);
    throw error;
  }
};

/**
 * Trigger logging all cache keys to backend console (Admin only)
 */
export const logAllRedisCaches = async () => {
  try {
    const response = await api.post('/admin/redis/log-all');
    return getApiData(response);
  } catch (error) {
    console.error('Failed to log Redis caches:', error);
    throw error;
  }
};

export default {
  refreshModelRegistry,
  getAvailableRecommendationModels,
  setActiveRecommendationModel,
  getHealthStatus,
  getModelInfo,
  triggerRetrain,
  getRecommendations,
  getSimilarBooks,
  getOnlineLearningStatus,
  enableOnlineLearning,
  disableOnlineLearning,
  triggerIncrementalUpdate,
  getCacheStats,
  clearRecommendationCache,
  getRedisCacheSummary,
  getAllRedisCaches,
  searchRedisKeys,
  getRedisKeyInfo,
  getRedisKeyValue,
  logAllRedisCaches,
};
