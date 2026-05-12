/**
 * ModelDetailsCard
 * Hiển thị thông tin chi tiết của ALS model và SBERT model.
 */
import { Row, Col, Card, Descriptions, Tag } from 'antd';
import { UserOutlined, BookOutlined, DatabaseOutlined } from '@ant-design/icons';

const fmt = (v) => (v == null ? 'N/A' : v?.toLocaleString?.() ?? v);

const EmptyModel = () => (
  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
    <DatabaseOutlined style={{ fontSize: 48, marginBottom: 16 }} />
    <p>Model chưa được load</p>
  </div>
);

const ModelDetailsCard = ({ modelInfo }) => {
  if (!modelInfo) return null;

  const als = modelInfo?.cf_model;
  const sbert = modelInfo?.content_model;

  const density = als
    ? ((als.matrix_nnz / Math.max(1, als.num_users * als.num_items)) * 100).toFixed(4) + '%'
    : 'N/A';

  return (
    <Row gutter={[16, 16]}>
      {/* ALS Model */}
      <Col xs={24} lg={12}>
        <Card
          title={<span><UserOutlined style={{ marginRight: 8 }} />Implicit ALS Model</span>}
          extra={als ? <Tag color="success">Active</Tag> : <Tag color="default">Not Loaded</Tag>}
        >
          {als ? (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Users">{fmt(als.num_users)}</Descriptions.Item>
              <Descriptions.Item label="Items">{fmt(als.num_items)}</Descriptions.Item>
              <Descriptions.Item label="Factors">{als.factors ?? 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Iterations">{als.iterations ?? 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Regularization">{als.regularization ?? 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Matrix NNZ">{fmt(als.matrix_nnz)}</Descriptions.Item>
              <Descriptions.Item label="Density">{density}</Descriptions.Item>
            </Descriptions>
          ) : <EmptyModel />}
        </Card>
      </Col>

      {/* SBERT Model */}
      <Col xs={24} lg={12}>
        <Card
          title={<span><BookOutlined style={{ marginRight: 8 }} />SBERT Model</span>}
          extra={sbert ? <Tag color="success">Active</Tag> : <Tag color="default">Not Loaded</Tag>}
        >
          {sbert ? (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Model Name">{sbert.model_name}</Descriptions.Item>
              <Descriptions.Item label="Books">{fmt(sbert.num_books)}</Descriptions.Item>
              <Descriptions.Item label="User Profiles">{fmt(sbert.num_user_profiles)}</Descriptions.Item>
              <Descriptions.Item label="Embedding Dim">{sbert.embedding_dim || 'N/A'}</Descriptions.Item>
            </Descriptions>
          ) : <EmptyModel />}
        </Card>
      </Col>
    </Row>
  );
};

export default ModelDetailsCard;
