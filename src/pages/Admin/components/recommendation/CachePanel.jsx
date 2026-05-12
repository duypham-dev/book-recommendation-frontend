/**
 * CachePanel
 * Quản lý Redis cache: thống kê, xóa cache, xem chi tiết từng key.
 */
import { useState } from 'react';
import {
  Card, Row, Col, Statistic, Button, Modal, Alert,
  Table, Tag, Tooltip, Spin, Collapse, message, Typography, Space,
} from 'antd';
import {
  UserOutlined, BookOutlined, ThunderboltOutlined,
  DatabaseOutlined, ReloadOutlined, SearchOutlined,
  KeyOutlined, ClockCircleOutlined, EyeOutlined, WarningOutlined,
} from '@ant-design/icons';
import {
  clearRecommendationCache,
  getAllRedisCaches,
  getRedisKeyValue,
} from '../../../../services/recommendationService';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

// Hiển thị TTL dạng "Xm Ys" hoặc "No expiry"
const formatTtl = (ttl) =>
  ttl > 0 ? `${Math.floor(ttl / 60)}m ${ttl % 60}s` : 'No expiry';

// Các cột cho bảng cache keys
const buildColumns = (onViewKey) => [
  {
    title: 'Key', dataIndex: 'key', key: 'key', width: '38%',
    render: (text) => (
      <Tooltip title={text}>
        <Text ellipsis style={{ maxWidth: 280 }}>{text}</Text>
      </Tooltip>
    ),
  },
  {
    title: 'Type', dataIndex: 'type', key: 'type', width: '10%',
    render: (t) => <Tag color="blue">{t}</Tag>,
  },
  {
    title: 'TTL', dataIndex: 'ttlSeconds', key: 'ttlSeconds', width: '15%',
    render: (ttl) => <span><ClockCircleOutlined style={{ marginRight: 4 }} />{formatTtl(ttl)}</span>,
  },
  {
    title: 'Value Type', dataIndex: 'valueType', key: 'valueType', width: '17%',
    render: (t) => <Tag color="green">{t}</Tag>,
  },
  {
    title: 'Preview', dataIndex: 'valuePreview', key: 'valuePreview', width: '13%',
    render: (p) => <Tooltip title={p}><Text ellipsis style={{ maxWidth: 120 }}>{p}</Text></Tooltip>,
  },
  {
    title: '', key: 'actions', width: '7%',
    render: (_, record) => (
      <Button type="link" icon={<EyeOutlined />} onClick={() => onViewKey(record.key)} size="small">
        Xem
      </Button>
    ),
  },
];

const CachePanel = ({ cacheStats, onRefresh }) => {
  const [cacheDetails, setCacheDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  // Modal xem giá trị key
  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const [keyValue, setKeyValue] = useState(null);
  const [loadingKeyValue, setLoadingKeyValue] = useState(false);

  // Tải chi tiết cache keys
  const loadDetails = async () => {
    setLoadingDetails(true);
    try {
      const data = await getAllRedisCaches();
      setCacheDetails(data);
    } catch {
      message.error('Không thể tải chi tiết Redis cache');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Xem giá trị của 1 key
  const handleViewKey = async (key) => {
    setSelectedKey(key);
    setKeyValue(null);
    setKeyModalVisible(true);
    setLoadingKeyValue(true);
    try {
      const val = await getRedisKeyValue(key);
      setKeyValue(val);
    } catch {
      message.error('Không thể lấy giá trị key');
    } finally {
      setLoadingKeyValue(false);
    }
  };

  // Xóa toàn bộ cache
  const handleClearCache = () => {
    Modal.confirm({
      title: 'Xác nhận xóa cache',
      icon: <WarningOutlined />,
      content: (
        <div>
          <p>Bạn có chắc muốn xóa toàn bộ cache gợi ý sách?</p>
          <ul>
            <li>Xóa cache recommendations cho tất cả users</li>
            <li>Xóa cache similar books cho tất cả sách</li>
          </ul>
          <p>Cache sẽ được tạo lại khi có request mới.</p>
        </div>
      ),
      okText: 'Xóa cache', cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setClearingCache(true);
          const result = await clearRecommendationCache();
          message.success(`Đã xóa ${result?.deletedCount ?? 0} cache keys`);
          setCacheDetails(null);
          onRefresh();
        } catch {
          message.error('Không thể xóa cache');
        } finally {
          setClearingCache(false);
        }
      },
    });
  };

  const columns = buildColumns(handleViewKey);

  return (
    <>
      {/* Thống kê */}
      <Card
        title={<span><DatabaseOutlined style={{ marginRight: 8 }} />Redis Cache Statistics</span>}
        extra={
          <Button danger loading={clearingCache} onClick={handleClearCache} icon={<ReloadOutlined />}>
            Xóa toàn bộ cache
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Statistic title="Recommendations" value={cacheStats?.recommendationsCount ?? 0}
              prefix={<UserOutlined />} suffix="keys" valueStyle={{ color: '#1890ff' }} />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic title="Similar Books" value={cacheStats?.similarBooksCount ?? 0}
              prefix={<BookOutlined />} suffix="keys" valueStyle={{ color: '#52c41a' }} />
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} loading={loadingDetails} onClick={loadDetails}>
              Xem chi tiết các keys
            </Button>
          </Space>
        </div>

        {/* Bảng chi tiết cache keys */}
        {cacheDetails && (
          <Collapse
            defaultActiveKey={['recommendations', 'similarBooks']}
            style={{ marginTop: 16 }}
          >
            {Object.entries(cacheDetails).map(([name, keys]) => (
              <Panel
                header={<span><KeyOutlined style={{ marginRight: 8 }} />{name} ({keys?.length ?? 0} keys)</span>}
                key={name}
              >
                {keys?.length > 0 ? (
                  <Table
                    dataSource={keys}
                    rowKey="key"
                    size="small"
                    pagination={{ pageSize: 5, size: 'small' }}
                    columns={columns}
                  />
                ) : (
                  <Alert message="Không có key nào trong cache này" type="info" />
                )}
              </Panel>
            ))}
          </Collapse>
        )}

        <Alert
          message="Cache được tự động xóa khi model retrain hoặc khi online learning update profiles"
          type="info" showIcon style={{ marginTop: 16 }}
        />
      </Card>

      {/* Modal xem giá trị key */}
      <Modal
        title={<span><KeyOutlined style={{ marginRight: 8 }} />Key: {selectedKey}</span>}
        open={keyModalVisible}
        onCancel={() => { setKeyModalVisible(false); setKeyValue(null); }}
        footer={[<Button key="close" onClick={() => setKeyModalVisible(false)}>Đóng</Button>]}
        width={800}
      >
        {loadingKeyValue ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
          </div>
        ) : keyValue != null ? (
          <>
            <Paragraph>
              <Text strong>Key: </Text><Text code copyable>{selectedKey}</Text>
            </Paragraph>
            <pre style={{
              background: '#f5f5f5', padding: 16, borderRadius: 8,
              maxHeight: 400, overflow: 'auto', fontSize: 12,
            }}>
              {JSON.stringify(keyValue, null, 2)}
            </pre>
          </>
        ) : (
          <Alert message="Không thể lấy giá trị của key này" type="warning" />
        )}
      </Modal>
    </>
  );
};

export default CachePanel;
