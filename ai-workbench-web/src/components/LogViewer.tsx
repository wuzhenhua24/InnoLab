import React, { useEffect, useRef } from 'react';
import { Space } from 'antd';
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
import { useTheme } from '../contexts/ThemeContext';

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
  const stickToBottomRef = useRef(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    stickToBottomRef.current = distanceToBottom < 40;
  };

  // 自动滚动到日志面板底部（不滚动整个页面）
  useEffect(() => {
    if (!autoScroll || !stickToBottomRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
  }, [logs.length, autoScroll]);

  // 获取日志级别对应的图标和颜色
  const getLogLevelConfig = (level: string) => {
    const configs = {
      [LogLevel.INFO]: {
        icon: <InfoCircleOutlined />,
        color: 'var(--color-primary)',
        bgColor: isDark ? 'rgba(0, 212, 255, 0.08)' : 'rgba(14, 165, 233, 0.08)',
      },
      [LogLevel.SUCCESS]: {
        icon: <CheckCircleOutlined />,
        color: 'var(--color-accent-green)',
        bgColor: isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(22, 163, 74, 0.08)',
      },
      [LogLevel.ERROR]: {
        icon: <CloseCircleOutlined />,
        color: 'var(--color-accent-red)',
        bgColor: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(220, 38, 38, 0.08)',
      },
      [LogLevel.WARNING]: {
        icon: <ExclamationCircleOutlined />,
        color: 'var(--color-accent-orange)',
        bgColor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(217, 119, 6, 0.08)',
      },
      [LogLevel.METRICS]: {
        icon: <DashboardOutlined />,
        color: 'var(--color-secondary)',
        bgColor: isDark ? 'rgba(168, 85, 247, 0.08)' : 'rgba(139, 92, 246, 0.08)',
      },
      [LogLevel.STATUS_UPDATE]: {
        icon: <SyncOutlined />,
        color: '#06b6d4',
        bgColor: 'rgba(6, 182, 212, 0.08)',
      },
    };

    return (
      configs[level as LogLevel] || {
        icon: <InfoCircleOutlined />,
        color: 'var(--text-tertiary)',
        bgColor: isDark ? 'rgba(100, 116, 139, 0.08)' : 'rgba(100, 116, 139, 0.06)',
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
          background: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(139, 92, 246, 0.08)',
          border: `1px solid ${isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <DashboardOutlined style={{ color: 'var(--color-secondary)', fontSize: '14px' }} />
          <span style={{ color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 600 }}>执行指标</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {metrics.duration !== undefined && (
            <div>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>耗时</span>
              <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>{metrics.duration}s</div>
            </div>
          )}
          {metrics.tokenUsage !== undefined && (
            <div>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>Token 消耗</span>
              <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>{metrics.tokenUsage.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: isDark ? 'rgba(10, 14, 23, 0.8)' : 'var(--bg-tertiary)',
        borderRadius: '12px',
        border: '1px solid var(--border-primary)',
        padding: '16px',
        height: isStreaming ? '320px' : undefined,
        maxHeight: isStreaming ? '320px' : '400px',
        overflowY: 'auto',
        fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      }}
      ref={containerRef}
      onScroll={handleScroll}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={4}>
        {logs.map((log, index) => {
          const config = getLogLevelConfig(log.level);
          return (
            <div
              key={log.id}
              style={{
                padding: '8px 12px',
                background: config.bgColor,
                borderRadius: '6px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                opacity: 0,
                animation: 'logFadeIn 0.3s ease-out forwards',
                animationDelay: `${index * 0.02}s`,
              }}
            >
              <span style={{ color: config.color, marginTop: '2px', fontSize: '12px' }}>
                {config.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '10px',
                      fontFamily: "'JetBrains Mono', monospace",
                      flexShrink: 0,
                    }}
                  >
                    {dayjs(log.timestamp).format('HH:mm:ss.SSS')}
                  </span>
                  <span
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}
                  >
                    {log.message}
                  </span>
                </div>
                {/* 显示元数据 */}
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div style={{ marginTop: '6px', paddingLeft: '4px' }}>
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <span
                        key={key}
                        style={{
                          display: 'inline-block',
                          marginRight: '12px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-secondary)',
                          fontSize: '10px',
                        }}
                      >
                        <span style={{ color: 'var(--text-tertiary)' }}>{key}:</span> {JSON.stringify(value)}
                      </span>
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
              padding: '8px 12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <span style={{ color: 'var(--color-primary)' }}>
              <SyncOutlined spin />
            </span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
              正在执行...
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '14px',
                background: 'var(--color-primary)',
                animation: 'cursorBlink 1s step-end infinite',
                marginLeft: '4px',
                borderRadius: '1px',
              }}
            />
          </div>
        )}

        {/* 执行指标 */}
        {renderMetrics()}
      </Space>

      <style>{`
        @keyframes cursorBlink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        @keyframes logFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LogViewer;
