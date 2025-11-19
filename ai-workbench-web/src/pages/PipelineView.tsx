import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Space, Divider, Modal, message } from 'antd';
import { ThunderboltOutlined, ArrowRightOutlined } from '@ant-design/icons';
import StageCard from '../components/StageCard';
import type { Pipeline, LogEntry, ExecutionMetrics } from '../types/pipeline';
import { StageStatus, StageType, LogLevel } from '../types/pipeline';

const { Title, Text } = Typography;

const PipelineView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // Mock初始流水线数据
  const [pipeline, setPipeline] = useState<Pipeline>({
    id: 'pipeline-1',
    projectId: projectId || '1',
    projectName: 'E-Commerce Platform',
    isAutoRunning: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stages: [
      {
        id: 'stage-0',
        type: StageType.PROJECT_ANALYSIS,
        name: '项目分析',
        description: '自动分析代码库结构、技术栈、主要逻辑',
        status: StageStatus.COMPLETED,
        order: 0,
        autoRun: true,
        artifacts: [
          {
            name: 'PROJECT_ANALYSIS.md',
            url: '/artifacts/project-analysis.md',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'stage-1',
        type: StageType.DOC_UPLOAD,
        name: '文档上传',
        description: '上传需求文档、设计稿等原始资料',
        status: StageStatus.COMPLETED,
        order: 1,
        requiresInput: true,
        artifacts: [
          {
            name: '需求文档.md',
            url: '/artifacts/requirement-doc.md',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
        completedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'stage-2',
        type: StageType.PRD_GEN,
        name: 'PRD生成',
        description: '基于上传的文档自动生成标准化的PRD',
        status: StageStatus.PENDING,
        order: 2,
        artifacts: [],
      },
      {
        id: 'stage-3',
        type: StageType.ARCHITECTURE,
        name: '架构设计',
        description: '基于PRD和项目分析生成系统架构设计',
        status: StageStatus.PENDING,
        order: 3,
        artifacts: [],
      },
      {
        id: 'stage-4',
        type: StageType.DETAILED_DESIGN,
        name: '详细设计',
        description: '生成详细的技术设计文档和接口定义',
        status: StageStatus.PENDING,
        order: 4,
        artifacts: [],
      },
      {
        id: 'stage-5',
        type: StageType.CODE_DEV,
        name: '开发代码',
        description: '根据详细设计生成完整的代码实现',
        status: StageStatus.PENDING,
        order: 5,
        artifacts: [],
      },
      {
        id: 'stage-6',
        type: StageType.TEST_CASE,
        name: '测试用例',
        description: '为生成的代码创建单元测试和集成测试用例',
        status: StageStatus.PENDING,
        order: 6,
        artifacts: [],
      },
      {
        id: 'stage-7',
        type: StageType.TEST_SCRIPT,
        name: '测试脚本',
        description: '生成自动化测试脚本和测试执行工具',
        status: StageStatus.PENDING,
        order: 7,
        artifacts: [],
      },
    ],
  });

  // Mock: 生成模拟日志
  const generateMockLogs = (stageName: string): LogEntry[] => {
    const baseTime = Date.now();
    const logs: LogEntry[] = [
      {
        id: `${baseTime}-1`,
        level: LogLevel.STATUS_UPDATE,
        message: `开始执行 ${stageName} 阶段...`,
        timestamp: new Date(baseTime).toISOString(),
      },
      {
        id: `${baseTime}-2`,
        level: LogLevel.INFO,
        message: '正在初始化执行环境...',
        timestamp: new Date(baseTime + 200).toISOString(),
      },
      {
        id: `${baseTime}-3`,
        level: LogLevel.SUCCESS,
        message: '环境初始化完成',
        timestamp: new Date(baseTime + 500).toISOString(),
      },
      {
        id: `${baseTime}-4`,
        level: LogLevel.INFO,
        message: '正在加载项目上下文...',
        timestamp: new Date(baseTime + 700).toISOString(),
      },
      {
        id: `${baseTime}-5`,
        level: LogLevel.INFO,
        message: '分析代码库结构...',
        timestamp: new Date(baseTime + 1000).toISOString(),
        metadata: { files_analyzed: 142, directories: 28 },
      },
      {
        id: `${baseTime}-6`,
        level: LogLevel.SUCCESS,
        message: '代码库分析完成',
        timestamp: new Date(baseTime + 1500).toISOString(),
      },
      {
        id: `${baseTime}-7`,
        level: LogLevel.INFO,
        message: '调用AI模型生成内容...',
        timestamp: new Date(baseTime + 1700).toISOString(),
      },
      {
        id: `${baseTime}-8`,
        level: LogLevel.SUCCESS,
        message: 'AI模型响应成功',
        timestamp: new Date(baseTime + 3200).toISOString(),
      },
      {
        id: `${baseTime}-9`,
        level: LogLevel.INFO,
        message: '正在生成产出物...',
        timestamp: new Date(baseTime + 3400).toISOString(),
      },
      {
        id: `${baseTime}-10`,
        level: LogLevel.SUCCESS,
        message: '产出物生成完成',
        timestamp: new Date(baseTime + 4000).toISOString(),
      },
      {
        id: `${baseTime}-11`,
        level: LogLevel.STATUS_UPDATE,
        message: `${stageName} 阶段执行完成，等待审核`,
        timestamp: new Date(baseTime + 4200).toISOString(),
      },
    ];
    return logs;
  };

  // Mock: 生成执行指标
  const generateMockMetrics = (): ExecutionMetrics => {
    return {
      duration: Math.floor(Math.random() * 10 + 5), // 5-15秒
      tokenUsage: Math.floor(Math.random() * 5000 + 1000), // 1000-6000 tokens
    };
  };

  // Mock: 模拟实时日志流
  const simulateLogStreaming = (
    stageId: string,
    logs: LogEntry[],
    onComplete: () => void
  ) => {
    let currentIndex = 0;
    const interval = 400; // 每400ms推送一条日志

    const streamInterval = setInterval(() => {
      if (currentIndex < logs.length) {
        const logToAdd = logs[currentIndex];
        setPipeline((prev) => ({
          ...prev,
          stages: prev.stages.map((stage) =>
            stage.id === stageId
              ? {
                  ...stage,
                  logs: [...(stage.logs || []), logToAdd],
                }
              : stage
          ),
        }));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        // 日志推送完成，执行回调
        onComplete();
      }
    }, interval);

    return streamInterval;
  };

  // 运行单个阶段
  const handleRunStage = useCallback((stageId: string) => {
    // 获取阶段名称
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (!stage) return;

    // 设置阶段为运行中并自动展开
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((s) =>
        s.id === stageId
          ? {
              ...s,
              status: StageStatus.RUNNING,
              startedAt: new Date().toISOString(),
              expanded: true,
              logs: [],
              metrics: undefined,
            }
          : s
      ),
    }));

    // 生成模拟日志并开始流式推送
    const mockLogs = generateMockLogs(stage.name);
    simulateLogStreaming(stageId, mockLogs, () => {
      // 日志推送完成后，更新状态为等待审核，并添加执行指标
      setPipeline((prev) => ({
        ...prev,
        stages: prev.stages.map((s) =>
          s.id === stageId
            ? {
                ...s,
                status: StageStatus.WAITING_REVIEW,
                metrics: generateMockMetrics(),
                artifacts: [
                  {
                    name: `${s.name}_产出.md`,
                    url: `/artifacts/${s.type}.md`,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : s
        ),
      }));
      message.success(`${stage.name} 执行完成，等待审核`);
    });
  }, [pipeline.stages]);

  // 批准阶段
  const handleApproveStage = useCallback((stageId: string) => {
    setPipeline((prev) => {
      const stageIndex = prev.stages.findIndex((s) => s.id === stageId);
      const updatedStages = prev.stages.map((stage, index) => {
        if (stage.id === stageId) {
          return {
            ...stage,
            status: StageStatus.COMPLETED,
            completedAt: new Date().toISOString(),
          };
        }
        // 激活下一个阶段
        if (index === stageIndex + 1 && stage.status === StageStatus.PENDING) {
          return { ...stage };
        }
        return stage;
      });

      return { ...prev, stages: updatedStages };
    });
    message.success('阶段已批准，下一阶段已激活');
  }, []);

  // 一键执行所有
  const handleRunAll = useCallback(() => {
    Modal.confirm({
      title: '确认一键执行',
      content: '这将自动执行所有待处理的阶段，且无需人工审核。确认继续？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setPipeline((prev) => ({ ...prev, isAutoRunning: true }));
        message.info('开始一键执行流水线...');

        // Mock: 模拟自动执行所有待处理的阶段
        const pendingStages = pipeline.stages.filter((s) => s.status === StageStatus.PENDING);
        let cumulativeDelay = 500;

        pendingStages.forEach((stage, index) => {
          // 开始运行阶段
          setTimeout(() => {
            setPipeline((prev) => ({
              ...prev,
              stages: prev.stages.map((s) =>
                s.id === stage.id
                  ? {
                      ...s,
                      status: StageStatus.RUNNING,
                      startedAt: new Date().toISOString(),
                      expanded: true,
                      logs: [],
                      metrics: undefined,
                    }
                  : s
              ),
            }));

            // 生成并推送日志
            const mockLogs = generateMockLogs(stage.name);
            simulateLogStreaming(stage.id, mockLogs, () => {
              // 日志推送完成后直接标记为完成（一键执行无需审核），并添加执行指标
              setPipeline((prev) => ({
                ...prev,
                stages: prev.stages.map((s) =>
                  s.id === stage.id
                    ? {
                        ...s,
                        status: StageStatus.COMPLETED,
                        completedAt: new Date().toISOString(),
                        metrics: generateMockMetrics(),
                        artifacts: [
                          {
                            name: `${s.name}_产出.md`,
                            url: `/artifacts/${s.type}.md`,
                            createdAt: new Date().toISOString(),
                          },
                        ],
                      }
                    : s
                ),
              }));

              // 最后一个阶段完成时结束
              if (index === pendingStages.length - 1) {
                message.success('流水线执行完成！');
                setPipeline((prev) => ({ ...prev, isAutoRunning: false }));
              }
            });
          }, cumulativeDelay);

          // 每个阶段间隔约5秒（日志推送时间）
          cumulativeDelay += 5500;
        });
      },
    });
  }, [pipeline.stages]);

  // 查看产出物
  const handleViewArtifact = useCallback((url: string) => {
    message.info(`查看产出物: ${url}`);
    // TODO: 实现产出物查看功能
  }, []);

  // 渲染流水线可视化
  const renderPipelineVisualization = () => {
    return (
      <div
        style={{
          padding: '40px 20px',
          background: '#fafafa',
          borderRadius: '8px',
          marginBottom: '32px',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            minWidth: 'fit-content',
          }}
        >
          {pipeline.stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* 节点 */}
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background:
                    stage.status === StageStatus.COMPLETED
                      ? '#52c41a'
                      : stage.status === StageStatus.RUNNING
                      ? '#1890ff'
                      : stage.status === StageStatus.WAITING_REVIEW
                      ? '#faad14'
                      : stage.status === StageStatus.FAILED
                      ? '#ff4d4f'
                      : '#d9d9d9',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  writingMode: 'vertical-rl',
                  letterSpacing: '2px',
                }}
              >
                {stage.name}
              </div>

              {/* 连接线 */}
              {index < pipeline.stages.length - 1 && (
                <ArrowRightOutlined style={{ fontSize: '20px', color: '#bfbfbf' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* 顶部标题和操作 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Space>
          <Title level={3} style={{ margin: 0 }}>
            项目: {pipeline.projectName}
          </Title>
          <Text type="secondary">/ AI流水线</Text>
        </Space>

        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleRunAll}
          disabled={pipeline.isAutoRunning}
          loading={pipeline.isAutoRunning}
        >
          {pipeline.isAutoRunning ? '执行中...' : '一键执行所有'}
        </Button>
      </div>

      {/* 流水线可视化 */}
      {renderPipelineVisualization()}

      <Divider orientation="left">
        <Text strong style={{ fontSize: '16px' }}>
          阶段详情
        </Text>
      </Divider>

      {/* 阶段列表 */}
      <div>
        {pipeline.stages.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            onRun={handleRunStage}
            onApprove={handleApproveStage}
            onViewArtifact={handleViewArtifact}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelineView;
