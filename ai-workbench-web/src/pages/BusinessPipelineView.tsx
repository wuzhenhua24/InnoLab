import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Space, Divider, Modal, message } from 'antd';
import { BulbOutlined, ArrowRightOutlined } from '@ant-design/icons';
import BusinessStageCard from '../components/BusinessStageCard';
import MarkdownEditor from '../components/MarkdownEditor';
import type { Pipeline, StageArtifact } from '../types/pipeline';
import { StageStatus, StageType, ArtifactType } from '../types/pipeline';

const { Title, Text, Paragraph } = Typography;

const BusinessPipelineView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // 业务工作台的简化流水线（3个节点）
  const [pipeline, setPipeline] = useState<Pipeline>({
    id: 'business-pipeline-1',
    projectId: projectId || '1',
    projectName: '',
    isAutoRunning: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stages: [
      {
        id: 'business-stage-1',
        type: StageType.IDEA_RESEARCH,
        name: '创意与调研',
        description: '输入您的创意想法，AI将为您进行市场调研和用户画像分析',
        status: StageStatus.PENDING,
        order: 1,
        artifacts: [],
      },
      {
        id: 'business-stage-2',
        type: StageType.PRODUCT_REVIEW,
        name: '产品定义',
        description: 'AI已根据您的调研生成了产品方案，请审阅并批准',
        status: StageStatus.PENDING,
        order: 2,
        artifacts: [],
      },
      {
        id: 'business-stage-3',
        type: StageType.DEMO_DELIVERY,
        name: 'Demo交付',
        description: '您的Demo将在这里交付，可直接访问和分享',
        status: StageStatus.PENDING,
        order: 3,
        artifacts: [],
      },
    ],
  });

  // 用户输入的想法
  const [userIdea, setUserIdea] = useState('');

  // 编辑器状态
  const [editingArtifact, setEditingArtifact] = useState<StageArtifact | null>(null);
  const [viewingArtifact, setViewingArtifact] = useState<StageArtifact | null>(null);

  // 节点1：开始调研
  const handleStartResearch = useCallback((idea: string) => {
    setUserIdea(idea);

    // 提取项目名称（取想法的前15个字符）
    const projectName = idea.slice(0, 15) + (idea.length > 15 ? '...' : '');
    setPipeline((prev) => ({ ...prev, projectName }));

    // 设置节点1为运行中
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((s) =>
        s.id === 'business-stage-1'
          ? { ...s, status: StageStatus.RUNNING, startedAt: new Date().toISOString() }
          : s
      ),
    }));

    // 模拟DeepResearch执行（3秒）
    setTimeout(() => {
      setPipeline((prev) => ({
        ...prev,
        stages: prev.stages.map((s) => {
          if (s.id === 'business-stage-1') {
            return {
              ...s,
              status: StageStatus.COMPLETED,
              completedAt: new Date().toISOString(),
              artifacts: [
                {
                  name: '市场与用户画像分析.md',
                  url: '/artifacts/business/market-analysis.md',
                  type: ArtifactType.MARKDOWN,
                  content: generateMarketAnalysis(idea),
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          }
          // 激活节点2并开始生成PRD
          if (s.id === 'business-stage-2') {
            return { ...s, status: StageStatus.RUNNING };
          }
          return s;
        }),
      }));

      message.success('市场调研完成，AI正在为您生成产品方案...');

      // 再过3秒生成PRD
      setTimeout(() => {
        setPipeline((prev) => ({
          ...prev,
          stages: prev.stages.map((s) =>
            s.id === 'business-stage-2'
              ? {
                  ...s,
                  status: StageStatus.WAITING_REVIEW,
                  artifacts: [
                    {
                      name: '产品需求文档(PRD).md',
                      url: '/artifacts/business/prd.md',
                      type: ArtifactType.MARKDOWN,
                      content: generatePRD(idea),
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : s
          ),
        }));

        message.warning('产品方案已生成，请审核并批准', 5);
      }, 3000);
    }, 3000);
  }, []);

  // 节点2：编辑PRD
  const handleEditPRD = useCallback((artifact: StageArtifact) => {
    setEditingArtifact(artifact);
  }, []);

  // 保存PRD编辑
  const handleSavePRD = useCallback((newContent: string) => {
    if (!editingArtifact) return;

    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) => ({
        ...stage,
        artifacts: stage.artifacts.map((art) =>
          art.url === editingArtifact.url ? { ...art, content: newContent } : art
        ),
      })),
    }));

    setEditingArtifact(null);
    message.success('PRD已保存');
  }, [editingArtifact]);

  // 节点2：批准PRD并开始构建
  const handleApprovePRD = useCallback(() => {
    Modal.confirm({
      title: '确认批准并开始构建？',
      content: '批准后，AI研发团队将开始全自动构建（架构→代码→测试→部署），预计需要30分钟。期间无需人工介入。',
      okText: '确认批准',
      cancelText: '取消',
      onOk: () => {
        // 节点2标记为完成
        setPipeline((prev) => ({
          ...prev,
          stages: prev.stages.map((s) => {
            if (s.id === 'business-stage-2') {
              return { ...s, status: StageStatus.COMPLETED };
            }
            // 节点3开始运行
            if (s.id === 'business-stage-3') {
              return { ...s, status: StageStatus.RUNNING, startedAt: new Date().toISOString() };
            }
            return s;
          }),
        }));

        message.success('产品方案已批准，AI研发团队开始构建...');

        // 模拟30分钟的构建过程（这里缩短为10秒演示）
        setTimeout(() => {
          setPipeline((prev) => ({
            ...prev,
            stages: prev.stages.map((s) =>
              s.id === 'business-stage-3'
                ? {
                    ...s,
                    status: StageStatus.COMPLETED,
                    completedAt: new Date().toISOString(),
                    artifacts: [
                      {
                        name: 'Demo应用',
                        url: `https://demo.example.com/${projectId || 'your-app'}`,
                        type: ArtifactType.MARKDOWN,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  }
                : s
            ),
          }));

          message.success('🎉 Demo构建完成！您的创意已成功转化为产品原型', 10);
        }, 10000);
      },
    });
  }, [projectId]);

  // 查看产出物
  const handleViewArtifact = useCallback((artifact: StageArtifact) => {
    setViewingArtifact(artifact);
  }, []);

  // 渲染流水线可视化
  const renderPipelineVisualization = () => {
    return (
      <div
        style={{
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          marginBottom: '32px',
          color: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {pipeline.stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div
                style={{
                  textAlign: 'center',
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  border:
                    stage.status !== StageStatus.PENDING
                      ? '2px solid rgba(255, 255, 255, 0.5)'
                      : '2px solid transparent',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {stage.status === StageStatus.COMPLETED ? '✓' : stage.order}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{stage.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                  {stage.status === StageStatus.RUNNING && '进行中...'}
                  {stage.status === StageStatus.WAITING_REVIEW && '待审核'}
                  {stage.status === StageStatus.COMPLETED && '已完成'}
                  {stage.status === StageStatus.PENDING && ''}
                </div>
              </div>
              {index < pipeline.stages.length - 1 && (
                <ArrowRightOutlined style={{ fontSize: '24px', opacity: 0.6 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* 顶部标题 */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Space>
          <BulbOutlined style={{ fontSize: '32px', color: '#667eea' }} />
          <Title level={2} style={{ margin: 0 }}>
            Idea-to-Demo 业务工作台
          </Title>
        </Space>
        <Paragraph type="secondary" style={{ marginTop: '8px', fontSize: '16px' }}>
          将您的创意想法，快速转化为可交互的产品原型
        </Paragraph>
        {pipeline.projectName && (
          <Text type="secondary">当前项目: {pipeline.projectName}</Text>
        )}
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
          <BusinessStageCard
            key={stage.id}
            stage={stage}
            ideaInput={userIdea}
            onStartResearch={handleStartResearch}
            onEditPRD={handleEditPRD}
            onApprovePRD={handleApprovePRD}
            onViewArtifact={handleViewArtifact}
          />
        ))}
      </div>

      {/* PRD编辑器 */}
      {editingArtifact && (
        <MarkdownEditor
          visible={true}
          title={`编辑 - ${editingArtifact.name}`}
          initialContent={editingArtifact.content || ''}
          onSave={handleSavePRD}
          onCancel={() => setEditingArtifact(null)}
        />
      )}

      {/* 查看产出物 */}
      {viewingArtifact && (
        <MarkdownEditor
          visible={true}
          title={viewingArtifact.name}
          initialContent={viewingArtifact.content || ''}
          onSave={() => {}} // 只读模式
          onCancel={() => setViewingArtifact(null)}
        />
      )}
    </div>
  );
};

// Mock生成市场分析
function generateMarketAnalysis(idea: string): string {
  return `# 市场与用户画像分析

## 1. 市场概况

基于您的创意："${idea}"

### 市场规模
- 目标市场规模：中等
- 增长趋势：稳定增长
- 市场成熟度：中等成熟

### 目标用户群体
1. **核心用户**：爱好者和收藏家
2. **年龄分布**：25-45岁
3. **消费能力**：中高消费水平

## 2. 竞品分析

### 主要竞品
1. 闲鱼/转转：综合二手交易平台
2. 小红书：社区分享平台
3. 垂直收藏类App

### 竞品优劣势
- **优势**：用户基数大、交易体系完善
- **劣势**：缺乏专业性、信息分散

## 3. 用户需求洞察

### 核心痛点
1. 真伪鉴别困难
2. 交易信任度低
3. 价格不透明
4. 缺乏专业交流社区

### 期望功能
1. 图鉴查询功能
2. 一口价交易
3. 物品交换功能
4. 社区交流

## 4. 机会与建议

**市场机会**：专注垂直领域，打造专业化平台

**产品建议**：
- 强化图鉴功能
- 建立信用体系
- 提供鉴定服务
- 打造社区生态
`;
}

// Mock生成PRD
function generatePRD(idea: string): string {
  return `# 产品需求文档 (PRD)

## 1. 产品概述

**产品名称**：基于创意 "${idea}" 的应用

**产品定位**：专业的爱好者交流与交易平台

**核心价值**：为用户提供安全、专业、便捷的交易和交流体验

## 2. 用户画像

### 主要用户
- **收藏爱好者**：希望买卖、交换收藏品
- **新手玩家**：想要了解和入门
- **资深玩家**：寻求稀有品和高端交流

## 3. 核心功能

### 3.1 图鉴功能
- 完整的产品目录
- 详细的产品信息
- 高清图片展示
- 市场参考价格

### 3.2 交易功能
- **一口价交易**：明码标价，即买即卖
- **物品交换**：支持以物换物
- **求购功能**：发布求购信息

### 3.3 社区功能
- 用户展示收藏
- 经验分享
- 话题讨论
- 活动组织

### 3.4 个人中心
- 收藏管理
- 交易记录
- 信用评级
- 消息通知

## 4. 技术架构

- **前端**：React + TypeScript
- **后端**：Node.js + Express
- **数据库**：MongoDB
- **部署**：云服务器

## 5. MVP范围

### 第一版本包含
1. 基础图鉴浏览
2. 一口价交易
3. 用户注册登录
4. 简单的个人中心

### 暂不包含
1. 复杂的社区功能
2. 拍卖功能
3. 第三方支付集成

## 6. 成功指标

- 注册用户数：目标100+
- 日活跃用户：目标20+
- 交易成功率：目标60%+
`;
}

export default BusinessPipelineView;
