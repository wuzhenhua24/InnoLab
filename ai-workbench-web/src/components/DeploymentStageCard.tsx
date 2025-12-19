import React, { useState, useEffect } from 'react';
import { Button, Typography, Progress, Alert } from 'antd';
import {
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  RocketOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useThemeColors } from '../contexts/ThemeContext';

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
  const colors = useThemeColors();

  // 当部署开始时自动展开日志
  useEffect(() => {
    if (status === 'deploying') {
      setExpanded(true);
    }
  }, [status]);

  // 状态配置
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <ClockCircleOutlined />,
          color: colors.textTertiary,
          bgColor: `${colors.textTertiary}1a`,
          borderColor: `${colors.textTertiary}33`,
          text: '待处理',
        };
      case 'deploying':
        return {
          icon: <LoadingOutlined spin />,
          color: colors.primary,
          bgColor: `${colors.primary}1a`,
          borderColor: `${colors.primary}4d`,
          text: '部署中',
        };
      case 'success':
        return {
          icon: <CheckCircleOutlined />,
          color: colors.success,
          bgColor: `${colors.success}1a`,
          borderColor: `${colors.success}4d`,
          text: '已完成',
        };
      case 'failed':
        return {
          icon: <CloseCircleOutlined />,
          color: colors.error,
          bgColor: `${colors.error}1a`,
          borderColor: `${colors.error}4d`,
          text: '失败',
        };
      default:
        return {
          icon: <ClockCircleOutlined />,
          color: colors.textTertiary,
          bgColor: `${colors.textTertiary}1a`,
          borderColor: `${colors.textTertiary}33`,
          text: '未知',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // 日志级别颜色
  const getLogColor = (level: DeploymentLog['level']) => {
    switch (level) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  // 渲染操作按钮
  const renderActions = () => {
    if (status === 'pending') {
      return (
        <Button
          type="primary"
          icon={<RocketOutlined />}
          onClick={onDeploy}
          style={{
            height: '36px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          运行
        </Button>
      );
    }

    if (status === 'deploying') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: `${colors.primary}1a`,
            borderRadius: '8px',
            border: `1px solid ${colors.primary}33`,
          }}
        >
          <LoadingOutlined style={{ color: colors.primary }} spin />
          <span style={{ color: colors.primary, fontSize: '13px', fontWeight: 500 }}>部署中...</span>
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <Button
          type="primary"
          danger
          icon={<RocketOutlined />}
          onClick={onDeploy}
          style={{
            height: '36px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          重试
        </Button>
      );
    }

    if (status === 'success' && deployUrl) {
      return (
        <Button
          type="link"
          icon={<LinkOutlined />}
          href={deployUrl}
          target="_blank"
          style={{
            height: '36px',
            padding: '0 12px',
            color: colors.primary,
          }}
        >
          查看详情
        </Button>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        background: colors.gradientSecondary,
        border: `1px solid ${status === 'deploying' ? statusConfig.borderColor : colors.borderPrimary}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: status === 'deploying' ? `0 0 30px ${statusConfig.bgColor}` : 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: expanded ? `1px solid ${colors.borderPrimary}` : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Order Badge */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: statusConfig.bgColor,
              border: `1px solid ${statusConfig.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: statusConfig.color,
            }}
          >
            {stageOrder}
          </div>

          {/* Title & Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.textPrimary,
                }}
              >
                {stageName}
              </span>
              {/* Status Tag */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: statusConfig.bgColor,
                  border: `1px solid ${statusConfig.borderColor}`,
                  fontSize: '11px',
                  fontWeight: 600,
                  color: statusConfig.color,
                }}
              >
                {statusConfig.icon}
                {statusConfig.text}
              </span>
            </div>
            <Text style={{ color: colors.textTertiary, fontSize: '13px' }}>
              将代码部署到目标环境（Dev/Staging/Production）
            </Text>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Actions */}
          {renderActions()}

          {/* Expand Toggle */}
          {(logs.length > 0 || status === 'success' || status === 'failed') && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: colors.bgSurface,
                border: `1px solid ${colors.borderPrimary}`,
                color: colors.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.borderAccent;
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.borderPrimary;
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              {expanded ? <UpOutlined style={{ fontSize: '12px' }} /> : <DownOutlined style={{ fontSize: '12px' }} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div style={{ padding: '20px 24px' }}>
          {/* 部署进度 */}
          {status === 'deploying' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text style={{ color: colors.textSecondary, fontSize: '13px' }}>部署进度</Text>
              </div>
              <Progress
                percent={progress}
                status="active"
                strokeColor={colors.primary}
                trailColor={colors.bgSurface}
              />
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
                      <a href={deployUrl} target="_blank" rel="noopener noreferrer" style={{ color: colors.primary }}>
                        点击查看部署详情
                      </a>
                    </>
                  )}
                </span>
              }
              type="success"
              showIcon
              style={{
                marginBottom: '20px',
                background: `${colors.success}1a`,
                border: `1px solid ${colors.success}33`,
                borderRadius: '10px',
              }}
            />
          )}

          {/* 失败提示 */}
          {status === 'failed' && (
            <Alert
              message="部署失败"
              description="部署过程中出现错误，请查看日志并重试"
              type="error"
              showIcon
              style={{
                marginBottom: '20px',
                background: `${colors.error}1a`,
                border: `1px solid ${colors.error}33`,
                borderRadius: '10px',
              }}
            />
          )}

          {/* 实时日志 */}
          {logs.length > 0 && (
            <div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: 600 }}>实时构建日志</span>
              </div>
              <div
                style={{
                  padding: '16px',
                  background: colors.bgSecondary,
                  borderRadius: '12px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
                  fontSize: '12px',
                  border: `1px solid ${colors.borderPrimary}`,
                }}
              >
                {logs.map((log, index) => (
                  <Paragraph
                    key={index}
                    style={{
                      color: getLogColor(log.level),
                      margin: '4px 0',
                      fontSize: '12px',
                      lineHeight: 1.6,
                    }}
                  >
                    <Text style={{ color: colors.textMuted }}>[{log.timestamp}]</Text>{' '}
                    {log.message}
                  </Paragraph>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeploymentStageCard;
