import React, { useEffect, useRef } from 'react';
import { Typography, Space } from 'antd';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { LogEntry, ExecutionMetrics } from '../types/pipeline';
import { LogLevel } from '../types/pipeline';
import dayjs from 'dayjs';

const { Text } = Typography;

interface LogViewerProps {
  logs: LogEntry[];
  isStreaming?: boolean;
  metrics?: ExecutionMetrics;
  autoScroll?: boolean;
}

const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  isStreaming = false,
  metrics,
  autoScroll = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (autoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // 获取日志级别对应的图标和颜色
  const getLogLevelConfig = (level: string) => {
    const configs = {
      [LogLevel.INFO]: {
        icon: <InfoCircleOutlined />,
        color: '#1890ff',
        bgColor: 'rgba(24, 144, 255, 0.05)',
      },
      [LogLevel.SUCCESS]: {
        icon: <CheckCircleOutlined />,
        color: '#52c41a',
        bgColor: 'rgba(82, 196, 26, 0.05)',
      },
      [LogLevel.ERROR]: {
        icon: <CloseCircleOutlined />,
        color: '#ff4d4f',
        bgColor: 'rgba(255, 77, 79, 0.05)',
      },
      [LogLevel.WARNING]: {
        icon: <ExclamationCircleOutlined />,
        color: '#faad14',
        bgColor: 'rgba(250, 173, 20, 0.05)',
      },
      [LogLevel.METRICS]: {
        icon: <DashboardOutlined />,
        color: '#722ed1',
        bgColor: 'rgba(114, 46, 209, 0.05)',
      },
      [LogLevel.STATUS_UPDATE]: {
        icon: <SyncOutlined />,
        color: '#13c2c2',
        bgColor: 'rgba(19, 194, 194, 0.05)',
      },
    };

    return (
      configs[level as LogLevel] || {
        icon: <InfoCircleOutlined />,
        color: '#8c8c8c',
        bgColor: 'rgba(140, 140, 140, 0.05)',
      }
    );
  };

  // 渲染执行指标
  const renderMetrics = () => {
    if (!metrics) return null;

    return (
      <div
        style={{
          marginTop: '12px',
          padding: '12px 16px',
          background: 'rgba(114, 46, 209, 0.05)',
          borderLeft: '3px solid #722ed1',
          borderRadius: '4px',
        }}
      >
        <Space direction="vertical" size="small">
          <Text strong style={{ color: '#722ed1' }}>
            <DashboardOutlined /> 执行指标
          </Text>
          <Space size="large">
            {metrics.duration !== undefined && (
              <Text type="secondary">
                耗时: <Text strong>{metrics.duration}s</Text>
              </Text>
            )}
            {metrics.tokenUsage !== undefined && (
              <Text type="secondary">
                Token: <Text strong>{metrics.tokenUsage.toLocaleString()}</Text>
              </Text>
            )}
          </Space>
        </Space>
      </div>
    );
  };

  return (
    <div
      style={{
        background: '#000',
        borderRadius: '4px',
        padding: '12px',
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      }}
      ref={containerRef}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {logs.map((log) => {
          const config = getLogLevelConfig(log.level);
          return (
            <div
              key={log.id}
              style={{
                padding: '6px 8px',
                background: config.bgColor,
                borderRadius: '2px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ color: config.color, marginTop: '2px' }}>
                {config.icon}
              </span>
              <div style={{ flex: 1 }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    wordBreak: 'break-word',
                  }}
                >
                  <Text type="secondary" style={{ color: '#8c8c8c', marginRight: '8px' }}>
                    {dayjs(log.timestamp).format('HH:mm:ss.SSS')}
                  </Text>
                  {log.message}
                </Text>
                {/* 显示元数据 */}
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div style={{ marginTop: '4px', paddingLeft: '8px' }}>
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <Text
                        key={key}
                        style={{
                          color: '#595959',
                          fontSize: '11px',
                          display: 'block',
                        }}
                      >
                        {key}: {JSON.stringify(value)}
                      </Text>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 流式传输指示器 */}
        {isStreaming && (
          <div
            style={{
              padding: '6px 8px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#1890ff' }}>
              <SyncOutlined spin />
            </span>
            <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
              正在执行...
            </Text>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                background: '#52c41a',
                animation: 'blink 1s infinite',
                marginLeft: '4px',
              }}
            />
          </div>
        )}

        {/* 执行指标 */}
        {renderMetrics()}

        {/* 自动滚动锚点 */}
        <div ref={endRef} />
      </Space>

      <style>{`
        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LogViewer;
