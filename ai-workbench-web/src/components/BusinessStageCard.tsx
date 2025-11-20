import React, { useState } from 'react';
import { Card, Button, Tag, Typography, Space, Alert, Input, List } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  EditOutlined,
  EyeOutlined,
  LinkOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import type { PipelineStage, StageArtifact } from '../types/pipeline';
import { StageStatus, StageType } from '../types/pipeline';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface BusinessStageCardProps {
  stage: PipelineStage;
  ideaInput?: string; // 节点1的想法输入
  onStartResearch?: (idea: string) => void; // 节点1：开始调研
  onEditPRD?: (artifact: StageArtifact) => void; // 节点2：编辑PRD
  onApprovePRD?: () => void; // 节点2：批准PRD并开始构建
  onViewArtifact?: (artifact: StageArtifact) => void; // 查看产出物
}

const BusinessStageCard: React.FC<BusinessStageCardProps> = ({
  stage,
  ideaInput,
  onStartResearch,
  onEditPRD,
  onApprovePRD,
  onViewArtifact,
}) => {
  const [idea, setIdea] = useState('');

  // 状态标签配置
  const getStatusTag = () => {
    const statusConfig = {
      [StageStatus.PENDING]: {
        icon: <ClockCircleOutlined />,
        color: 'default',
        text: '待处理',
      },
      [StageStatus.RUNNING]: {
        icon: <LoadingOutlined spin />,
        color: 'processing',
        text: '运行中',
      },
      [StageStatus.WAITING_REVIEW]: {
        icon: <EyeOutlined />,
        color: 'warning',
        text: '待您审核',
      },
      [StageStatus.COMPLETED]: {
        icon: <CheckCircleOutlined />,
        color: 'success',
        text: '已完成',
      },
      [StageStatus.FAILED]: {
        icon: <CloseCircleOutlined />,
        color: 'error',
        text: '失败',
      },
    };

    const config = statusConfig[stage.status];
    return (
      <Tag icon={config.icon} color={config.color}>
        {config.text}
      </Tag>
    );
  };

  // 渲染节点1：创意与调研
  const renderIdeaResearch = () => {
    if (stage.status === StageStatus.PENDING) {
      return (
        <div>
          <Alert
            message="开始您的创意之旅"
            description="请描述您的产品想法，AI将为您进行市场调研和用户画像分析"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <TextArea
            rows={4}
            placeholder="例如：为Tomica模型车爱好者设计一个二手交易和图鉴App..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => onStartResearch?.(idea)}
            disabled={!idea.trim()}
          >
            开始调研
          </Button>
        </div>
      );
    }

    if (stage.status === StageStatus.RUNNING) {
      return (
        <Alert
          message="AI正在为您调研..."
          description="DeepResearch Agent正在分析市场、竞品和目标用户，请稍候"
          type="info"
          showIcon
          icon={<LoadingOutlined />}
        />
      );
    }

    if (stage.status === StageStatus.COMPLETED) {
      return (
        <div>
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">您的想法：</Text>
            <Paragraph style={{ padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
              {ideaInput}
            </Paragraph>
          </div>

          {stage.artifacts.length > 0 && (
            <div>
              <Text strong>调研产出：</Text>
              <List
                size="small"
                dataSource={stage.artifacts}
                renderItem={(artifact) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => onViewArtifact?.(artifact)}
                      >
                        查看
                      </Button>,
                    ]}
                  >
                    {artifact.name}
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // 渲染节点2：产品定义（关键审核点）
  const renderProductReview = () => {
    if (stage.status === StageStatus.PENDING) {
      return (
        <Alert
          message="等待上一阶段完成"
          description="调研完成后，AI将自动为您生成产品需求文档"
          type="info"
          showIcon
        />
      );
    }

    if (stage.status === StageStatus.RUNNING) {
      return (
        <Alert
          message="AI正在生成产品方案..."
          description="基于调研结果，AI正在为您定义产品需求"
          type="info"
          showIcon
          icon={<LoadingOutlined />}
        />
      );
    }

    if (stage.status === StageStatus.WAITING_REVIEW) {
      return (
        <div>
          <Alert
            message="⚠️ 请审核AI为您定义的产品"
            description="这是确保产品符合您预期的关键环节，请仔细查看PRD并进行必要的修改"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          {stage.artifacts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>产出物：</Text>
              <List
                size="small"
                dataSource={stage.artifacts}
                renderItem={(artifact) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => onViewArtifact?.(artifact)}
                      >
                        查看
                      </Button>,
                      <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEditPRD?.(artifact)}
                      >
                        编辑
                      </Button>,
                    ]}
                  >
                    {artifact.name}
                  </List.Item>
                )}
              />
            </div>
          )}

          <Button
            type="primary"
            size="large"
            icon={<CheckOutlined />}
            onClick={onApprovePRD}
            style={{ width: '100%' }}
          >
            👍 批准产品方案并开始构建
          </Button>

          <Alert
            message="批准后将进入全自动构建"
            description="您的AI研发团队将开始架构设计、代码开发、测试并部署，预计需要30分钟"
            type="info"
            showIcon
            style={{ marginTop: 12 }}
          />
        </div>
      );
    }

    if (stage.status === StageStatus.COMPLETED) {
      return (
        <Alert
          message="产品方案已批准"
          description="您的AI研发团队正在全速构建中..."
          type="success"
          showIcon
        />
      );
    }

    return null;
  };

  // 渲染节点3：Demo交付
  const renderDemoDelivery = () => {
    if (stage.status === StageStatus.PENDING) {
      return (
        <Alert
          message="等待产品方案批准"
          description="批准产品方案后，Demo将在约30分钟后交付"
          type="info"
          showIcon
        />
      );
    }

    if (stage.status === StageStatus.RUNNING) {
      return (
        <Alert
          message="您的AI研发团队正在构建..."
          description={
            <div>
              <div>正在进行：架构设计 → 代码开发 → 测试 → 部署</div>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">预计还需约 {stage.order} 分钟</Text>
              </div>
            </div>
          }
          type="info"
          showIcon
          icon={<LoadingOutlined />}
        />
      );
    }

    if (stage.status === StageStatus.COMPLETED) {
      const demoUrl = stage.artifacts[0]?.url || 'https://demo.example.com/your-app';

      return (
        <div>
          <Alert
            message="🎉 您的Demo已交付！"
            description="恭喜！您的创意已成功转化为可交互的产品Demo"
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ padding: 16, background: '#f0f5ff', borderRadius: 4, marginBottom: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Demo访问地址：</Text>
              <Input
                value={demoUrl}
                readOnly
                addonAfter={
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    href={demoUrl}
                    target="_blank"
                  >
                    打开
                  </Button>
                }
              />
            </Space>
          </div>

          <Space>
            <Button icon={<EditOutlined />}>简易编辑</Button>
            <Button icon={<LinkOutlined />}>分享Demo</Button>
          </Space>
        </div>
      );
    }

    return null;
  };

  // 根据节点类型渲染内容
  const renderContent = () => {
    switch (stage.type) {
      case StageType.IDEA_RESEARCH:
        return renderIdeaResearch();
      case StageType.PRODUCT_REVIEW:
        return renderProductReview();
      case StageType.DEMO_DELIVERY:
        return renderDemoDelivery();
      default:
        return null;
    }
  };

  return (
    <Card
      size="small"
      style={{ marginBottom: 24 }}
      title={
        <Space>
          <Text strong style={{ fontSize: 16 }}>
            [{stage.order}] {stage.name}
          </Text>
          {getStatusTag()}
        </Space>
      }
    >
      <div style={{ padding: '8px 0' }}>
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          {stage.description}
        </Paragraph>
        {renderContent()}
      </div>
    </Card>
  );
};

export default BusinessStageCard;
