/**
 * AdminRecommendation Page
 * Trang quản lý Hybrid Recommendation System (ALS + SBERT).
 *
 * Gồm 3 tab:
 * 1. Tổng quan — stat cards, model details (ALS + SBERT)
 * 2. Online Learning — bật/tắt, buffer, force update
 * 3. Redis Cache — thống kê, xem keys, xóa cache
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Card, Button, Tag, Tabs, Alert, Progress, Spin, Modal, message,
} from 'antd';
import {
  ReloadOutlined, SyncOutlined, CheckCircleOutlined,
  WarningOutlined, ThunderboltOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import ModelOverviewStats from './components/recommendation/ModelOverviewStats';
import ModelDetailsCard from './components/recommendation/ModelDetailsCard';
import OnlineLearningPanel from './components/recommendation/OnlineLearningPanel';
import CachePanel from './components/recommendation/CachePanel';
import {
  getHealthStatus,
  getModelInfo,
  getOnlineLearningStatus,
  getCacheStats,
  triggerRetrain,
} from '../../services/recommendationService';

// ─────────────────────────────────────────────
// Helper: Render tag trạng thái hệ thống
// ─────────────────────────────────────────────
const STATUS_CONFIG = {
  ok:         { color: 'success',    icon: <CheckCircleOutlined />, text: 'Hoạt động bình thường' },
  healthy:    { color: 'success',    icon: <CheckCircleOutlined />, text: 'Hoạt động bình thường' },
  retraining: { color: 'processing', icon: <SyncOutlined spin />,   text: 'Đang retrain...' },
  no_model:   { color: 'warning',    icon: <WarningOutlined />,     text: 'Model chưa được load' },
  error:      { color: 'error',      icon: <WarningOutlined />,     text: 'Lỗi hệ thống' },
};

const StatusTag = ({ status }) => {
  if (!status) return null;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.error;
  return (
    <Tag icon={cfg.icon} color={cfg.color} style={{ fontSize: 14, padding: '4px 12px' }}>
      {cfg.text}
    </Tag>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const AdminRecommendation = () => {
  const [activeTab, setActiveTab]             = useState('overview');
  const [loading, setLoading]                 = useState(true);
  const [retraining, setRetraining]           = useState(false);
  const [modelInfo, setModelInfo]             = useState(null);
  const [healthStatus, setHealthStatus]       = useState(null);
  const [olStatus, setOlStatus]               = useState(null);
  const [cacheStats, setCacheStats]           = useState(null);

  // Tải tất cả dữ liệu cần thiết cho trang
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [health, info, cache] = await Promise.all([
        getHealthStatus().catch(() => null),
        getModelInfo().catch(() => null),
        getCacheStats().catch(() => null),
      ]);
      setHealthStatus(health);
      setModelInfo(info);
      setCacheStats(cache);

      // Online learning status (RS trả về trực tiếp, không qua health)
      try {
        const ol = await getOnlineLearningStatus();
        setOlStatus(ol);
      } catch {
        setOlStatus(null);
      }
    } catch (err) {
      message.error('Không thể tải thông tin hệ thống');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load lần đầu
  useEffect(() => { loadAllData(); }, [loadAllData]);

  // Nếu đang retrain → tự động reload mỗi 3 giây
  useEffect(() => {
    if (!modelInfo?.is_retraining) return;
    const timer = setInterval(loadAllData, 3000);
    return () => clearInterval(timer);
  }, [modelInfo?.is_retraining, loadAllData]);

  // Trigger full retrain (cả ALS + SBERT)
  const handleRetrain = () => {
    Modal.confirm({
      title: 'Xác nhận retrain toàn bộ model',
      icon: <WarningOutlined />,
      content: (
        <div>
          <p>Quá trình này sẽ:</p>
          <ul>
            <li>Tải lại toàn bộ dữ liệu từ database</li>
            <li>Huấn luyện lại Implicit ALS model</li>
            <li>Huấn luyện lại SBERT model và user profiles</li>
            <li>Thay thế model hiện tại bằng model mới</li>
          </ul>
          <p><strong>Thời gian ước tính: 2–5 phút</strong></p>
        </div>
      ),
      okText: 'Retrain', cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setRetraining(true);
          await triggerRetrain();
          message.success('Đã bắt đầu retrain! Trang sẽ tự động cập nhật.');
          await loadAllData();
        } catch (err) {
          message.error(err?.response?.data?.message || 'Không thể trigger retrain');
        } finally {
          setRetraining(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Hệ thống gợi ý">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#666' }}>Đang tải thông tin model...</p>
        </div>
      </AdminLayout>
    );
  }

  const isRetraining = modelInfo?.is_retraining || healthStatus?.status === 'retraining';
  const modelsLoaded = healthStatus?.models_loaded;

  // ── Tab: Tổng quan ───────────────────────────
  const overviewTab = (
    <>
      <ModelOverviewStats modelInfo={modelInfo} />
      <CachePanel cacheStats={cacheStats} onRefresh={loadAllData} />
      <div style={{ marginTop: 24 }}>
        <ModelDetailsCard modelInfo={modelInfo} />
      </div>
    </>
  );

  // ── Tab: Online Learning ─────────────────────
  const onlineLearningTab = (
    <OnlineLearningPanel status={olStatus} onRefresh={loadAllData} />
  );

  // ── Tabs config ──────────────────────────────
  const tabItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      children: overviewTab,
    },
    {
      key: 'online-learning',
      label: <span><ThunderboltOutlined />Online Learning</span>,
      children: onlineLearningTab,
    },
  ];

  return (
    <AdminLayout title="Hệ thống gợi ý">
      {/* Header: status tag + action buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <StatusTag status={healthStatus?.status} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<ReloadOutlined />} onClick={loadAllData}>Làm mới</Button>
          <Button
            type="primary" danger
            icon={<SyncOutlined />}
            onClick={handleRetrain}
            loading={retraining}
            disabled={isRetraining || !modelsLoaded}
          >
            {isRetraining ? 'Đang retrain...' : 'Retrain Toàn Bộ'}
          </Button>
        </div>
      </div>

      {/* Banner retrain đang chạy */}
      {isRetraining && (
        <Alert
          message="Model đang được retrain"
          description={
            <div>
              <p>Hệ thống đang huấn luyện lại toàn bộ model với dữ liệu mới nhất...</p>
              <Progress percent={undefined} status="active" />
              <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                Trang tự động cập nhật mỗi 3 giây
              </p>
            </div>
          }
          type="info" showIcon icon={<SyncOutlined spin />}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Banner model chưa load */}
      {!modelsLoaded && !isRetraining && (
        <Alert
          message="Model chưa được load"
          description="Hệ thống chưa có model. Vui lòng retrain để tạo model mới."
          type="warning" showIcon style={{ marginBottom: 16 }}
        />
      )}

      {/* Tabs chính */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={tabItems}
      />
    </AdminLayout>
  );
};

export default AdminRecommendation;
