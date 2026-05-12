/**
 * ModelOverviewStats
 * Hiển thị 4 stat card: Alpha, ALS Users, SBERT Books, User Profiles
 */
import { Row, Col, Card, Statistic } from 'antd';
import { LineChartOutlined, UserOutlined, BookOutlined, ThunderboltOutlined } from '@ant-design/icons';

const ModelOverviewStats = ({ modelInfo }) => {
  if (!modelInfo) return null;

  const alpha = modelInfo?.alpha ?? 0;
  const alsUsers = modelInfo?.cf_model?.num_users ?? 0;
  const sbertBooks = modelInfo?.content_model?.num_books ?? 0;
  const userProfiles = modelInfo?.content_model?.num_user_profiles ?? 0;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Hybrid Alpha"
            value={alpha}
            precision={2}
            prefix={<LineChartOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            ALS: {(alpha * 100).toFixed(0)}% | SBERT: {((1 - alpha) * 100).toFixed(0)}%
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="ALS Users"
            value={alsUsers}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
          <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Collaborative Filtering</div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="SBERT Books"
            value={sbertBooks}
            prefix={<BookOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
          <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Content-Based</div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="User Profiles"
            value={userProfiles}
            prefix={<ThunderboltOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>SBERT Profiles</div>
        </Card>
      </Col>
    </Row>
  );
};

export default ModelOverviewStats;
