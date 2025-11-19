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
  PROJECT_ANALYSIS: 'project_analysis',     // S: 项目分析
  DOC_UPLOAD: 'doc_upload',                 // 1: 文档上传
  PRD_GEN: 'prd_gen',                       // 2: PRD生成
  ARCHITECTURE: 'architecture',              // 3: 架构设计
  DETAILED_DESIGN: 'detailed_design',        // 4: 详细设计
  CODE_DEV: 'code_dev',                      // 5: 开发代码
  TEST_CASE: 'test_case',                    // 6: 测试用例
  TEST_SCRIPT: 'test_script',                // 7: 测试脚本
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
