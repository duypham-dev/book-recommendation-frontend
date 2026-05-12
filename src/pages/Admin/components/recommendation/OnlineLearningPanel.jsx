/**
 * OnlineLearningPanel
 * Bảng điều khiển Online Learning: bật/tắt, buffer progress, force update.
 * Online Learning chỉ cập nhật SBERT profiles, ALS cần full retrain.
 */
import { useState } from 'react';
import {
  Row, Col, Card, Alert, Switch, Button, InputNumber,
  Progress, Space, message,
} from 'antd';
import {
  SettingOutlined, DatabaseOutlined,
  PlayCircleOutlined, ThunderboltOutlined,
} from '@ant-design/icons';
import {
  enableOnlineLearning,
  disableOnlineLearning,
  triggerIncrementalUpdate,
} from '../../../../services/recommendationService';

const OnlineLearningPanel = ({ status, onRefresh }) => {
  const [bufferSize, setBufferSize] = useState(status?.buffer_capacity ?? 100);
  const [updating, setUpdating] = useState(false);

  const enabled = status?.enabled === true;
  const bufferCurrent = status?.buffer_size ?? 0;
  const bufferCapacity = status?.buffer_capacity ?? 0;
  const bufferFull = status?.buffer_full === true;
  const bufferProgress = enabled && bufferCapacity > 0
    ? Math.min(100, (bufferCurrent / bufferCapacity) * 100)
    : 0;

  // Bật / tắt online learning
  const handleToggle = async (checked) => {
    try {
      if (checked) {
        await enableOnlineLearning(bufferSize);
        message.success(`Đã bật Online Learning (buffer=${bufferSize})`);
      } else {
        await disableOnlineLearning();
        message.success('Đã tắt Online Learning');
      }
      onRefresh();
    } catch {
      message.error('Không thể thay đổi trạng thái Online Learning');
    }
  };

  // Áp dụng buffer size mới (disable rồi enable lại với size mới)
  const handleApplyBuffer = async () => {
    if (bufferSize < 10 || bufferSize > 1000) {
      message.error('Buffer size phải từ 10 đến 1000');
      return;
    }
    try {
      await disableOnlineLearning();
      await enableOnlineLearning(bufferSize);
      message.success(`Đã cập nhật buffer size = ${bufferSize}`);
      onRefresh();
    } catch {
      message.error('Không thể cập nhật buffer size');
    }
  };

  // Trigger incremental update
  const handleUpdate = async (force) => {
    try {
      setUpdating(true);
      const result = await triggerIncrementalUpdate(force);
      if (result?.status === 'updated') {
        message.success(`Đã cập nhật ${result.interactions_processed ?? 0} tương tác`);
      } else {
        message.info(result?.message || 'Buffer chưa đủ ngưỡng');
      }
      onRefresh();
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không thể trigger update');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Alert
        message="Lưu ý về Online Learning"
        description={
          <div>
            <p><strong>Online Learning chỉ cập nhật SBERT user profiles</strong>, không cập nhật ALS model.</p>
            <p>Để cập nhật ALS, cần thực hiện <strong>Retrain Toàn Bộ</strong>.</p>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        {/* Điều khiển bật/tắt và trigger update */}
        <Col xs={24} lg={12}>
          <Card title={<span><SettingOutlined style={{ marginRight: 8 }} />Điều khiển Online Learning</span>}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 500 }}>Trạng thái:</span>
              <Switch checked={enabled} onChange={handleToggle} checkedChildren="Bật" unCheckedChildren="Tắt" />
            </div>

            {enabled && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    Buffer: {bufferCurrent} / {bufferCapacity}
                  </div>
                  <Progress
                    percent={bufferProgress}
                    status={bufferFull ? 'exception' : 'active'}
                    strokeColor={bufferFull ? '#ff4d4f' : '#1890ff'}
                  />
                  {bufferFull && (
                    <div style={{ fontSize: 12, color: '#ff4d4f', marginTop: 4 }}>
                      ⚠️ Buffer đầy! Nên trigger update ngay.
                    </div>
                  )}
                </div>

                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleUpdate(false)}
                    loading={updating}
                    disabled={!bufferFull}
                    block
                  >
                    Trigger Update (khi buffer đầy)
                  </Button>
                  <Button
                    danger
                    icon={<ThunderboltOutlined />}
                    onClick={() => handleUpdate(true)}
                    loading={updating}
                    block
                  >
                    Force Update (bất kể buffer)
                  </Button>
                </Space>
              </>
            )}
          </Card>
        </Col>

        {/* Cấu hình buffer size */}
        <Col xs={24} lg={12}>
          <Card title={<span><DatabaseOutlined style={{ marginRight: 8 }} />Cấu hình Buffer</span>}>
            <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>Buffer Size (10–1000)</div>
            <InputNumber
              value={bufferSize}
              onChange={setBufferSize}
              min={10}
              max={1000}
              style={{ width: '100%', marginBottom: 8 }}
            />
            <div style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>
              Số tương tác tích lũy trước khi trigger update tự động.
            </div>
            <Button type="primary" onClick={handleApplyBuffer} disabled={!enabled} block>
              Áp dụng Buffer Size
            </Button>
            {status?.note && (
              <Alert message={status.note} type="info" showIcon style={{ marginTop: 16 }} />
            )}
          </Card>
        </Col>
      </Row>

      {/* Giải thích về Online Learning */}
      <Card title="Về Online Learning" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, lineHeight: 1.8 }}>
          <h4>🚀 Online Learning là gì?</h4>
          <p>Cập nhật <strong>SBERT user profiles</strong> một cách incremental mà không cần retrain toàn bộ.</p>
          <h4>📊 Cách hoạt động:</h4>
          <ol>
            <li>Hệ thống thu thập tương tác người dùng vào <strong>buffer</strong></li>
            <li>Khi buffer đầy, tự động trigger update</li>
            <li>Hoặc dùng <strong>Force Update</strong> bất kỳ lúc nào</li>
          </ol>
          <h4>⚠️ Hạn chế:</h4>
          <ul>
            <li>Chỉ cập nhật SBERT, ALS giữ nguyên</li>
            <li>Để cập nhật ALS, cần Retrain Toàn Bộ</li>
          </ul>
        </div>
      </Card>
    </>
  );
};

export default OnlineLearningPanel;
