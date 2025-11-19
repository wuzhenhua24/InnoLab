import React from 'react';
import { Card, Button, Tag, Typography, Space, Spin, Alert, List } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { PipelineStage } from '../types/pipeline';
import { StageStatus } from '../types/pipeline';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface StageCardProps {
  stage: PipelineStage;
  onRun?: (stageId: string) => void;
  onApprove?: (stageId: string) => void;
  onViewArtifact?: (artifactUrl: string) => void;
}

const StageCard: React.FC<StageCardProps> = ({
  stage,
  onRun,
  onApprove,
  onViewArtifact,
}) => {
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
        text: '待审核',
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

  // 操作按钮
  const renderActions = () => {
    if (stage.status === StageStatus.PENDING && !stage.autoRun) {
      return (
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={() => onRun?.(stage.id)}
        >
          运行
        </Button>
      );
    }

    if (stage.status === StageStatus.WAITING_REVIEW) {
      return (
        <Button
          type="primary"
          onClick={() => onApprove?.(stage.id)}
        >
          批准
        </Button>
      );
    }

    if (stage.status === StageStatus.RUNNING) {
      return <Spin indicator={<LoadingOutlined spin />} />;
    }

    return null;
  };

  return (
    <Card
      style={{
        marginBottom: '16px',
        borderRadius: '8px',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 标题和状态 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Title level={5} style={{ margin: 0 }}>
              [{stage.order === 0 ? 'S' : stage.order}] {stage.name}
            </Title>
            {getStatusTag()}
          </Space>
          {renderActions()}
        </div>

        {/* 描述 */}
        <Text type="secondary">{stage.description}</Text>

        {/* 错误信息 */}
        {stage.error && (
          <Alert
            message="执行失败"
            description={stage.error}
            type="error"
            showIcon
          />
        )}

        {/* 产出物列表 */}
        {stage.artifacts && stage.artifacts.length > 0 && (
          <div>
            <Text strong>产出物:</Text>
            <List
              size="small"
              dataSource={stage.artifacts}
              renderItem={(artifact) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      size="small"
                      icon={<FileTextOutlined />}
                      onClick={() => onViewArtifact?.(artifact.url)}
                    >
                      查看
                    </Button>,
                  ]}
                >
                  <Space>
                    <FileTextOutlined />
                    <Text>{artifact.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {dayjs(artifact.createdAt).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}

        {/* 时间信息 */}
        {stage.completedAt && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            完成时间: {dayjs(stage.completedAt).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default StageCard;
