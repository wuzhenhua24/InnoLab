import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Space, Divider, Modal, message } from 'antd';
import { ThunderboltOutlined, ArrowRightOutlined } from '@ant-design/icons';
import StageCard from '../components/StageCard';
import type { Pipeline } from '../types/pipeline';
import { StageStatus, StageType } from '../types/pipeline';

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

  // 运行单个阶段
  const handleRunStage = useCallback((stageId: string) => {
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) =>
        stage.id === stageId
          ? { ...stage, status: StageStatus.RUNNING, startedAt: new Date().toISOString() }
          : stage
      ),
    }));

    // Mock: 模拟异步执行
    setTimeout(() => {
      setPipeline((prev) => {
        const currentStage = prev.stages.find((s) => s.id === stageId);
        const updatedPipeline = {
          ...prev,
          stages: prev.stages.map((stage) =>
            stage.id === stageId
              ? {
                  ...stage,
                  status: StageStatus.WAITING_REVIEW,
                  artifacts: [
                    {
                      name: `${stage.name}_产出.md`,
                      url: `/artifacts/${stage.type}.md`,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : stage
          ),
        };
        message.success(`${currentStage?.name} 执行完成，等待审核`);
        return updatedPipeline;
      });
    }, 2000);
  }, []);

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

        // Mock: 模拟自动执行
        const pendingStages = pipeline.stages.filter((s) => s.status === StageStatus.PENDING);
        let delay = 1000;

        pendingStages.forEach((stage, index) => {
          // 开始运行
          setTimeout(() => {
            setPipeline((prev) => ({
              ...prev,
              stages: prev.stages.map((s) =>
                s.id === stage.id
                  ? { ...s, status: StageStatus.RUNNING, startedAt: new Date().toISOString() }
                  : s
              ),
            }));
          }, delay);

          // 完成
          delay += 3000;
          setTimeout(() => {
            setPipeline((prev) => ({
              ...prev,
              stages: prev.stages.map((s) =>
                s.id === stage.id
                  ? {
                      ...s,
                      status: StageStatus.COMPLETED,
                      completedAt: new Date().toISOString(),
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

            if (index === pendingStages.length - 1) {
              message.success('流水线执行完成！');
              setPipeline((prev) => ({ ...prev, isAutoRunning: false }));
            }
          }, delay);
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
