/**
 * 项目数据类型定义
 */

export interface Project {
  id: string;
  name: string;
  repository?: string;
  branch?: string;
  lastUpdated: string;
  createdAt: string;
}

export interface CreateProjectInput {
  name: string;
  repository?: string;
  branch?: string;
}
