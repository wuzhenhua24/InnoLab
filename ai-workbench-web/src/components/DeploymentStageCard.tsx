import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Tag, Typography, Progress, Alert } from 'antd';
import {
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export type DeploymentStatus = 'pending' | 'deploying' | 'success' | 'failed';

export interface DeploymentLog {
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'error' | 'warning';
}

interface DeploymentStageCardProps {
  stageName: string;
  stageOrder: number;
  environment: string;
  status: DeploymentStatus;
  logs: DeploymentLog[];
  deployUrl?: string;
  progress?: number;
  onDeploy: () => void;
}

const DeploymentStageCard: React.FC<DeploymentStageCardProps> = ({
  stageName,
  stageOrder,
  environment,
  status,
  logs,
  deployUrl,
  progress = 0,
  onDeploy,
}) => {
  const [expanded, setExpanded] = useState(false);

  // 当部署开始时自动展开日志
  useEffect(() => {
    if (status === 'deploying') {
      setExpanded(true);
    }
  }, [status]);

  // 状态图标和颜色
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <ClockCircleOutlined />,
          color: 'default',
          text: '待处理',
        };
      case 'deploying':
        return {
          icon: <LoadingOutlined spin />,
          color: 'processing',
          text: '部署中',
        };
      case 'success':
        return {
          icon: <CheckCircleOutlined />,
          color: 'success',
          text: '已完成',
        };
      case 'failed':
        return {
          icon: <CloseCircleOutlined />,
          color: 'error',
          text: '失败',
        };
      default:
        return {
          icon: <ClockCircleOutlined />,
          color: 'default',
          text: '未知',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // 日志级别颜色
  const getLogColor = (level: DeploymentLog['level']) => {
    switch (level) {
      case 'success':
        return '#52c41a';
      case 'error':
        return '#ff4d4f';
      case 'warning':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  };

  return (
    <Card
      size="small"
      style={{ marginBottom: 16 }}
      title={
        <Space>
          <Text strong>[{stageOrder}] {stageName}</Text>
          <Tag icon={statusConfig.icon} color={statusConfig.color}>
            {statusConfig.text}
          </Tag>
        </Space>
      }
      extra={
        <Space>
          {status === 'pending' && (
            <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={onDeploy}
            >
              运行
            </Button>
          )}
          {status === 'failed' && (
            <Button
              type="primary"
              danger
              icon={<RocketOutlined />}
              onClick={onDeploy}
            >
              重试
            </Button>
          )}
          {status === 'success' && deployUrl && (
            <Button
              type="link"
              icon={<LinkOutlined />}
              href={deployUrl}
              target="_blank"
            >
              查看部署详情
            </Button>
          )}
        </Space>
      }
    >
      {/* 部署进度 */}
      {status === 'deploying' && (
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">部署进度</Text>
          <Progress percent={progress} status="active" />
        </div>
      )}

      {/* 成功提示 */}
      {status === 'success' && (
        <Alert
          message="部署成功"
          description={
            <span>
              应用已成功部署到 <strong>{environment}</strong> 环境
              {deployUrl && (
                <>
                  ，
                  <a href={deployUrl} target="_blank" rel="noopener noreferrer">
                    点击查看部署详情
                  </a>
                </>
              )}
            </span>
          }
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 失败提示 */}
      {status === 'failed' && (
        <Alert
          message="部署失败"
          description="部署过程中出现错误，请查看日志并重试"
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 实时日志 */}
      {logs.length > 0 && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Space>
              <Text type="secondary">实时构建日志</Text>
              <Button
                type="link"
                size="small"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? '收起' : '展开'}
              </Button>
            </Space>
          </div>

          {expanded && (
            <div
              style={{
                padding: 12,
                background: '#000',
                borderRadius: 4,
                maxHeight: 300,
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              {logs.map((log, index) => (
                <Paragraph
                  key={index}
                  style={{
                    color: getLogColor(log.level),
                    margin: '2px 0',
                    fontSize: 12,
                  }}
                >
                  <Text style={{ color: '#8c8c8c' }}>[{log.timestamp}]</Text>{' '}
                  {log.message}
                </Paragraph>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default DeploymentStageCard;
