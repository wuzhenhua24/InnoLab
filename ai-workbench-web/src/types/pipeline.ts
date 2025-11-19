/**
 * AI流水线数据类型定义
 */

/**
 * 阶段状态
 */
export const StageStatus = {
  PENDING: 'pending',           // 待处理
  RUNNING: 'running',           // 运行中
  WAITING_REVIEW: 'waiting_review', // 待审核
  COMPLETED: 'completed',       // 已完成
  FAILED: 'failed',            // 失败
} as const;

export type StageStatus = typeof StageStatus[keyof typeof StageStatus];

/**
 * 阶段类型
 */
export const StageType = {
  CODE_ANALYSIS: 'code_analysis',     // S: 逆向代码分析
  PRD_INPUT: 'prd_input',             // 1: 需求文档
  ARCHITECTURE: 'architecture',        // 2: 架构设计
  CODE_GEN: 'code_gen',               // 3: 代码生成
  TEST_GEN: 'test_gen',               // 4: 测试用例生成
} as const;

export type StageType = typeof StageType[keyof typeof StageType];

/**
 * 阶段产出物
 */
export interface StageArtifact {
  name: string;
  url: string;
  createdAt: string;
}

/**
 * 流水线阶段
 */
export interface PipelineStage {
  id: string;
  type: StageType;
  name: string;
  description: string;
  status: StageStatus;
  order: number;
  artifacts: StageArtifact[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
  // 是否自动运行（如代码分析）
  autoRun?: boolean;
  // 是否需要人工输入（如PRD上传）
  requiresInput?: boolean;
}

/**
 * 流水线配置
 */
export interface Pipeline {
  id: string;
  projectId: string;
  projectName: string;
  stages: PipelineStage[];
  isAutoRunning: boolean;  // 是否处于一键执行模式
  createdAt: string;
  updatedAt: string;
}
