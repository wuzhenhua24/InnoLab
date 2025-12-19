import React, { useEffect, useRef, useState } from 'react';
import { Button, Typography, Alert, Input } from 'antd';
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
  CheckOutlined,
  ClockCircleFilled,
  ThunderboltOutlined,
  SendOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import type { PipelineStage, StageArtifact } from '../types/pipeline';
import { StageStatus, StageType, ArtifactType } from '../types/pipeline';
import LogViewer from './LogViewer';
import MarkdownEditor from './MarkdownEditor';
import dayjs from 'dayjs';
import { useThemeColors } from '../contexts/ThemeContext';

const { Text } = Typography;
const { TextArea } = Input;

interface StageCardProps {
  stage: PipelineStage;
  onRun?: (stageId: string, prompt?: string) => void;
  onApprove?: (stageId: string) => void;
  onReject?: (stageId: string) => void;
  onEditArtifact?: (stageId: string, artifact: StageArtifact, newContent: string) => void;
  onOpenInIDE?: (stageId: string) => void;
  onToggleExpand?: (stageId: string) => void;
}

const StageCard: React.FC<StageCardProps> = ({
  stage,
  onRun,
  onApprove,
  onReject,
  onEditArtifact,
  onOpenInIDE,
  onToggleExpand,
}) => {
  const [expanded, setExpanded] = useState(stage.expanded || false);
  const [editingArtifact, setEditingArtifact] = useState<StageArtifact | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const colors = useThemeColors();
  const prevArtifactsLengthRef = useRef(stage.artifacts?.length ?? 0);

  useEffect(() => {
    setExpanded(stage.expanded || false);
  }, [stage.expanded]);

  useEffect(() => {
    const currentLength = stage.artifacts?.length ?? 0;
    const prevLength = prevArtifactsLengthRef.current;
    prevArtifactsLengthRef.current = currentLength;

    if (prevLength === 0 && currentLength > 0) {
      setExpanded(true);
    }
  }, [stage.artifacts?.length]);

  // 判断是否是 AI 生成阶段（需要 prompt 输入）
  const isAIGeneratedStage = () => {
    const aiStageTypes: StageType[] = [
      StageType.PRD_GEN,
      StageType.ARCHITECTURE,
      StageType.DETAILED_DESIGN,
      StageType.CODE_DEV,
      StageType.TEST_CASE,
      StageType.TEST_SCRIPT,
    ];
    return aiStageTypes.includes(stage.type);
  };

  // 获取阶段的 placeholder 提示文字
  const getPromptPlaceholder = () => {
    switch (stage.type) {
      case StageType.PRD_GEN:
        return '请描述产品需求，例如：需要一个用户登录功能，支持手机号和邮箱登录...';
      case StageType.ARCHITECTURE:
        return '请描述架构要求，例如：采用微服务架构，需要支持高并发...';
      case StageType.DETAILED_DESIGN:
        return '请补充详细设计要求，例如：接口需要支持分页，数据库使用 MySQL...';
      case StageType.CODE_DEV:
        return '请描述开发要求，例如：使用 TypeScript，遵循 ESLint 规范...';
      case StageType.TEST_CASE:
        return '请描述测试重点，例如：重点测试边界条件和异常处理...';
      case StageType.TEST_SCRIPT:
        return '请描述测试脚本要求，例如：使用 Jest 框架，覆盖率需达到 80%...';
      default:
        return '请输入您的需求或补充说明...';
    }
  };

  const handleToggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggleExpand?.(stage.id);
  };

  const handleEditArtifact = (artifact: StageArtifact) => {
    setEditingArtifact(artifact);
  };

  const handleSaveArtifact = (newContent: string) => {
    if (editingArtifact) {
      onEditArtifact?.(stage.id, editingArtifact, newContent);
      setEditingArtifact(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingArtifact(null);
  };

  const isCodeStage = () => {
    return stage.type === StageType.CODE_DEV || stage.type === StageType.TEST_SCRIPT;
  };

  // 状态配置
  const getStatusConfig = () => {
    switch (stage.status) {
      case StageStatus.COMPLETED:
        return {
          icon: <CheckCircleOutlined />,
          color: colors.success,
          bgColor: `${colors.success}1a`,
          borderColor: `${colors.success}4d`,
          text: '已完成',
        };
      case StageStatus.RUNNING:
        return {
          icon: <LoadingOutlined spin />,
          color: colors.primary,
          bgColor: `${colors.primary}1a`,
          borderColor: `${colors.primary}4d`,
          text: '运行中',
        };
      case StageStatus.WAITING_REVIEW:
        return {
          icon: <EyeOutlined />,
          color: colors.warning,
          bgColor: `${colors.warning}1a`,
          borderColor: `${colors.warning}4d`,
          text: '待审核',
        };
      case StageStatus.FAILED:
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
          text: '待处理',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // 处理运行
  const handleRun = () => {
    onRun?.(stage.id, userPrompt.trim() || undefined);
    setUserPrompt('');
  };

  // 渲染操作按钮
  const renderActions = () => {
    if (stage.status === StageStatus.PENDING && !stage.autoRun) {
      // 对于 AI 阶段，不在这里显示运行按钮，而是在 prompt 输入区域显示
      if (isAIGeneratedStage()) {
        return null;
      }
      return (
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleRun}
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

    if (stage.status === StageStatus.WAITING_REVIEW) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            type="default"
            icon={<CloseCircleOutlined />}
            onClick={() => onReject?.(stage.id)}
            style={{
              height: '36px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: colors.error,
              color: colors.error,
            }}
          >
            拒绝
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => onApprove?.(stage.id)}
            style={{
              height: '36px',
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            }}
          >
            批准
          </Button>
        </div>
      );
    }

    if (stage.status === StageStatus.RUNNING) {
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
          <span style={{ color: colors.primary, fontSize: '13px', fontWeight: 500 }}>处理中...</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        background: colors.gradientSecondary,
        border: `1px solid ${stage.status === StageStatus.RUNNING ? statusConfig.borderColor : colors.borderPrimary}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: stage.status === StageStatus.RUNNING ? `0 0 30px ${statusConfig.bgColor}` : 'none',
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
            {stage.order === 0 ? 'S' : stage.order}
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
                {stage.name}
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
            <Text style={{ color: colors.textTertiary, fontSize: '13px' }}>{stage.description}</Text>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Metrics */}
          {stage.metrics && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ClockCircleFilled style={{ color: colors.textTertiary, fontSize: '12px' }} />
                <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{stage.metrics.duration}s</span>
              </div>
              {stage.metrics.tokenUsage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ThunderboltOutlined style={{ color: colors.textTertiary, fontSize: '12px' }} />
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{stage.metrics.tokenUsage.toLocaleString()} tokens</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {renderActions()}

          {/* Expand Toggle */}
          {(stage.status === StageStatus.RUNNING || stage.logs?.length || stage.artifacts?.length > 0) && (
            <button
              onClick={handleToggleExpand}
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

      {/* Prompt Input Area for AI Stages */}
      {isAIGeneratedStage() && stage.status === StageStatus.PENDING && !stage.autoRun && (
        <div
          style={{
            padding: '16px 24px',
            borderBottom: `1px solid ${colors.borderPrimary}`,
            background: colors.bgSurface,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: `${colors.primary}1a`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '4px',
              }}
            >
              <BulbOutlined style={{ color: colors.primary, fontSize: '16px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.textSecondary,
                  marginBottom: '8px',
                }}
              >
                输入您的需求（可选）
              </div>
              <TextArea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder={getPromptPlaceholder()}
                autoSize={{ minRows: 2, maxRows: 6 }}
                style={{
                  background: colors.bgSecondary,
                  borderColor: colors.borderSecondary,
                  color: colors.textPrimary,
                  borderRadius: '10px',
                  fontSize: '13px',
                  resize: 'none',
                }}
                onPressEnter={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    handleRun();
                  }
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                }}
              >
                <span style={{ fontSize: '11px', color: colors.textMuted }}>
                  按 Ctrl+Enter 快速运行，或点击右侧按钮
                </span>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleRun}
                  style={{
                    height: '36px',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  开始生成
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {expanded && (
        <div style={{ padding: '20px 24px' }}>
          {/* Error Alert */}
          {stage.error && (
            <Alert
              message="执行失败"
              description={stage.error}
              type="error"
              showIcon
              style={{
                marginBottom: '20px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
              }}
            />
          )}

          {/* Artifacts */}
          {stage.artifacts && stage.artifacts.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <FileTextOutlined style={{ color: colors.textTertiary, fontSize: '14px' }} />
                <span style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: 600 }}>产出物</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stage.artifacts.map((artifact, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: colors.bgSurface,
                      border: `1px solid ${colors.borderPrimary}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: artifact.type === ArtifactType.CODE
                            ? `${colors.secondary}1a`
                            : `${colors.primary}1a`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {artifact.type === ArtifactType.MARKDOWN ? (
                          <FileTextOutlined style={{ color: colors.primary, fontSize: '14px' }} />
                        ) : (
                          <CodeOutlined style={{ color: colors.secondary, fontSize: '14px' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ color: colors.textPrimary, fontSize: '13px', fontWeight: 500 }}>
                          {artifact.name}
                        </div>
                        <div style={{ color: colors.textTertiary, fontSize: '11px' }}>
                          {dayjs(artifact.createdAt).format('YYYY-MM-DD HH:mm')}
                        </div>
                      </div>
                    </div>
                    {artifact.type === ArtifactType.MARKDOWN && (
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditArtifact(artifact)}
                        style={{
                          color: colors.textSecondary,
                          height: '32px',
                          padding: '0 12px',
                        }}
                      >
                        编辑
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IDE Button for Code Stages */}
          {isCodeStage() && stage.status === StageStatus.WAITING_REVIEW && stage.artifacts.length > 0 && (
            <Button
              type="default"
              icon={<CodeOutlined />}
              onClick={() => onOpenInIDE?.(stage.id)}
              style={{
                marginBottom: '20px',
                height: '40px',
                background: `${colors.secondary}1a`,
                borderColor: `${colors.secondary}4d`,
                color: colors.secondary,
              }}
            >
              在 IDE 中审阅代码
            </Button>
          )}

          {/* Logs */}
          {(stage.status === StageStatus.RUNNING || (stage.logs && stage.logs.length > 0)) && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <span style={{ color: colors.textSecondary, fontSize: '13px', fontWeight: 600 }}>执行日志</span>
              </div>
              <LogViewer
                logs={stage.logs || []}
                isStreaming={stage.status === StageStatus.RUNNING}
                metrics={stage.metrics}
              />
            </div>
          )}

          {/* Completion Time */}
          {stage.completedAt && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: `1px solid ${colors.borderPrimary}`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircleOutlined style={{ color: colors.success, fontSize: '12px' }} />
              <Text style={{ color: colors.textTertiary, fontSize: '12px' }}>
                完成于 {dayjs(stage.completedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </div>
          )}
        </div>
      )}

      {/* Markdown Editor Modal */}
      {editingArtifact && (
        <MarkdownEditor
          visible={true}
          title={editingArtifact.name}
          initialContent={editingArtifact.content || ''}
          onSave={handleSaveArtifact}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default StageCard;
