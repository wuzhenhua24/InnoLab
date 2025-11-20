import React, { useState } from 'react';
import { Card, Button, Tag, Typography, Space, Spin, Alert, List } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
  DownOutlined,
  UpOutlined,
  EditOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import type { PipelineStage, StageArtifact } from '../types/pipeline';
import { StageStatus, StageType, ArtifactType } from '../types/pipeline';
import LogViewer from './LogViewer';
import MarkdownEditor from './MarkdownEditor';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface StageCardProps {
  stage: PipelineStage;
  onRun?: (stageId: string) => void;
  onApprove?: (stageId: string) => void;
  onEditArtifact?: (stageId: string, artifact: StageArtifact, newContent: string) => void;
  onOpenInIDE?: (stageId: string) => void;
  onToggleExpand?: (stageId: string) => void;
}

const StageCard: React.FC<StageCardProps> = ({
  stage,
  onRun,
  onApprove,
  onEditArtifact,
  onOpenInIDE,
  onToggleExpand,
}) => {
  const [expanded, setExpanded] = useState(stage.expanded || false);
  const [editingArtifact, setEditingArtifact] = useState<StageArtifact | null>(null);

  const handleToggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggleExpand?.(stage.id);
  };

  // 处理编辑产出物
  const handleEditArtifact = (artifact: StageArtifact) => {
    setEditingArtifact(artifact);
  };

  // 保存编辑后的产出物
  const handleSaveArtifact = (newContent: string) => {
    if (editingArtifact) {
      onEditArtifact?.(stage.id, editingArtifact, newContent);
      setEditingArtifact(null);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingArtifact(null);
  };

  // 判断是否为代码节点
  const isCodeStage = () => {
    return stage.type === StageType.CODE_DEV || stage.type === StageType.TEST_SCRIPT;
  };

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
                  actions={
                    // 只为Markdown类型的产出物显示编辑按钮
                    artifact.type === ArtifactType.MARKDOWN
                      ? [
                          <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEditArtifact(artifact)}
                          >
                            编辑
                          </Button>,
                        ]
                      : []
                  }
                >
                  <Space>
                    {artifact.type === ArtifactType.MARKDOWN ? (
                      <FileTextOutlined />
                    ) : (
                      <CodeOutlined />
                    )}
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

        {/* 代码节点的IDE编辑按钮 */}
        {isCodeStage() && stage.status === StageStatus.WAITING_REVIEW && stage.artifacts.length > 0 && (
          <Button
            type="primary"
            icon={<CodeOutlined />}
            onClick={() => onOpenInIDE?.(stage.id)}
            style={{ marginTop: '8px' }}
          >
            在IDE中审阅并编辑
          </Button>
        )}

        {/* 执行日志 */}
        {stage.logs && stage.logs.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <Text strong>执行日志:</Text>
              <Button
                type="text"
                size="small"
                icon={expanded ? <UpOutlined /> : <DownOutlined />}
                onClick={handleToggleExpand}
              >
                {expanded ? '收起' : '展开'}
              </Button>
            </div>
            {expanded && (
              <LogViewer
                logs={stage.logs}
                isStreaming={stage.status === StageStatus.RUNNING}
                metrics={stage.metrics}
              />
            )}
          </div>
        )}

        {/* 时间信息 */}
        {stage.completedAt && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            完成时间: {dayjs(stage.completedAt).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        )}
      </Space>

      {/* Markdown编辑器 */}
      {editingArtifact && (
        <MarkdownEditor
          visible={true}
          title={editingArtifact.name}
          initialContent={editingArtifact.content || ''}
          onSave={handleSaveArtifact}
          onCancel={handleCancelEdit}
        />
      )}
    </Card>
  );
};

export default StageCard;
