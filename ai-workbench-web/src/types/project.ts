/**
 * 项目数据类型定义
 */

export interface Repository {
  name: string;
  url: string;
  branch?: string;
}

export interface Project {
  id: string;
  name: string;
  repositories: Repository[];
  lastUpdated: string;
  createdAt: string;
}

export interface CreateProjectInput {
  name: string;
  repositories: Repository[];
}
