# AI研发工作台知识库集成方案

## 📋 文档信息

**版本：** V1.0
**创建日期：** 2025-11-17
**最后更新：** 2025-11-17
**状态：** 设计阶段
**作者：** InnoLab Team

---

## 🎯 方案目标

### 核心目标

1. **知识沉淀**：将AI研发平台运行过程中产生的文档、代码、设计等知识自动采集并存储
2. **智能检索**：用户可通过自然语言查询相关知识，快速找到所需信息
3. **智能问答**：基于知识库提供准确的问答服务，辅助用户决策
4. **知识复用**：历史项目的最佳实践可被后续项目借鉴和复用
5. **持续学习**：知识库随着平台使用不断丰富和优化

### 业务价值

- **提升效率**：减少重复学习成本，快速找到解决方案
- **质量提升**：基于历史最佳实践，提高输出质量
- **知识传承**：团队知识不随人员流失
- **辅助决策**：提供数据驱动的技术选型和架构建议

---

## 🏗️ 整体架构设计

### 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI研发工作台 (Main Platform)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 项目管理      │  │ 工作流引擎    │  │ Agent执行     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            ↓ 知识采集
┌─────────────────────────────────────────────────────────────────┐
│              知识采集层 (Knowledge Collector)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │文档采集器     │  │代码采集器     │  │日志采集器     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │变更监听器     │  │元数据提取器   │  │质量评估器     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            ↓ 知识处理
┌─────────────────────────────────────────────────────────────────┐
│              知识处理层 (Knowledge Processing)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │内容清洗       │  │分块切片       │  │元数据增强     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │向量化         │  │关系抽取       │  │去重合并       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            ↓ 知识存储
┌─────────────────────────────────────────────────────────────────┐
│              知识库系统 (Knowledge Base - RagFlow)                │
│  ┌───────────────────────────────────────────────────┐          │
│  │                RagFlow 核心引擎                      │          │
│  │  ┌──────────────┐  ┌──────────────┐              │          │
│  │  │文档存储       │  │向量数据库     │              │          │
│  │  └──────────────┘  └──────────────┘              │          │
│  │  ┌──────────────┐  ┌──────────────┐              │          │
│  │  │检索引擎       │  │问答引擎       │              │          │
│  │  └──────────────┘  └──────────────┘              │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            ↓ 知识服务
┌─────────────────────────────────────────────────────────────────┐
│              知识服务层 (Knowledge Service)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │智能检索API    │  │智能问答API    │  │知识推荐API    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │知识图谱查询   │  │相似项目匹配   │  │最佳实践推荐   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            ↓ 用户交互
┌─────────────────────────────────────────────────────────────────┐
│                    用户界面 (User Interface)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │知识搜索页     │  │智能问答聊天   │  │知识浏览器     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 知识来源与分类

### 知识来源识别

| 知识类型 | 来源 | 采集时机 | 价值等级 |
|---------|------|---------|---------|
| **PRD文档** | Agent生成/用户编辑 | 生成完成后、审核通过后 | 高 |
| **架构设计** | Agent生成 | 生成完成后 | 高 |
| **代码文件** | Agent生成 | 项目完成后 | 高 |
| **测试用例** | Agent生成 | 生成完成后 | 中 |
| **API文档** | Agent生成 | 生成完成后 | 高 |
| **用户反馈** | 用户评分/评论 | 实时采集 | 高 |
| **执行日志** | 系统运行 | 实时采集 | 中 |
| **错误记录** | 系统异常 | 实时采集 | 中 |
| **最佳实践** | 人工标注 | 人工标记时 | 高 |
| **技术决策** | 架构选型记录 | 决策完成后 | 高 |
| **用户修改** | 用户编辑AI输出 | 保存时 | 高 |
| **性能数据** | 监控系统 | 定期采集 | 低 |

### 知识分类体系

```yaml
知识分类:
  产品知识:
    - PRD文档
    - 用户故事
    - 功能需求
    - 验收标准
    - 业务流程

  技术知识:
    架构设计:
      - 系统架构
      - 技术选型
      - 数据模型
      - API设计
      - 安全设计

    代码知识:
      - 代码片段
      - 设计模式
      - 算法实现
      - 工具函数
      - 配置示例

    测试知识:
      - 测试用例
      - 测试策略
      - 自动化脚本
      - 性能基准

  经验知识:
    - 最佳实践
    - 踩坑记录
    - 优化方案
    - 问题解决方案
    - 技术决策记录

  项目知识:
    - 项目概览
    - 技术栈
    - 团队成员
    - 进度记录
    - 成本分析
```

---

## 🔧 知识采集系统设计

### 采集器架构

```typescript
/**
 * 知识采集器接口
 */
interface IKnowledgeCollector {
  /**
   * 采集器ID
   */
  readonly id: string;

  /**
   * 采集器名称
   */
  readonly name: string;

  /**
   * 支持的知识类型
   */
  readonly supportedTypes: KnowledgeType[];

  /**
   * 采集知识
   */
  collect(source: KnowledgeSource): Promise<KnowledgeItem[]>;

  /**
   * 验证知识质量
   */
  validate(item: KnowledgeItem): Promise<ValidationResult>;

  /**
   * 提取元数据
   */
  extractMetadata(item: KnowledgeItem): Promise<KnowledgeMetadata>;
}

/**
 * 知识类型
 */
enum KnowledgeType {
  PRD = 'prd',
  ARCHITECTURE = 'architecture',
  CODE = 'code',
  TEST = 'test',
  API_DOC = 'api_doc',
  BEST_PRACTICE = 'best_practice',
  USER_FEEDBACK = 'user_feedback',
  ERROR_LOG = 'error_log',
  DECISION_RECORD = 'decision_record'
}

/**
 * 知识来源
 */
interface KnowledgeSource {
  type: 'project' | 'execution' | 'artifact' | 'user_action';
  id: string;
  projectId?: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * 知识项
 */
interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  title: string;
  content: string;
  source: KnowledgeSource;
  metadata: KnowledgeMetadata;
  quality: QualityScore;
  tags: string[];
  createdAt: Date;
}

/**
 * 知识元数据
 */
interface KnowledgeMetadata {
  // 基础信息
  author?: string;
  projectId?: string;
  projectName?: string;
  language?: string;
  framework?: string;

  // 技术标签
  techStack?: string[];
  patterns?: string[];
  dependencies?: string[];

  // 质量指标
  complexity?: number;
  completeness?: number;
  accuracy?: number;

  // 业务信息
  domain?: string;
  industry?: string;
  scale?: 'small' | 'medium' | 'large';

  // 关联信息
  relatedProjects?: string[];
  references?: string[];

  // 自定义字段
  custom?: Record<string, any>;
}

/**
 * 质量评分
 */
interface QualityScore {
  overall: number;        // 总体评分 0-100
  completeness: number;   // 完整性
  accuracy: number;       // 准确性
  clarity: number;        // 清晰度
  usefulness: number;     // 实用性
  timeliness: number;     // 时效性
}
```

### 文档采集器实现

```typescript
/**
 * PRD文档采集器
 */
class PRDCollector implements IKnowledgeCollector {
  readonly id = 'prd-collector';
  readonly name = 'PRD文档采集器';
  readonly supportedTypes = [KnowledgeType.PRD];

  constructor(
    private db: Database,
    private qualityAnalyzer: QualityAnalyzer
  ) {}

  async collect(source: KnowledgeSource): Promise<KnowledgeItem[]> {
    // 从数据库获取PRD文档
    const artifacts = await this.db.artifacts.findMany({
      where: {
        projectId: source.projectId,
        type: 'prd',
        status: 'approved' // 只采集已审核通过的
      }
    });

    const items: KnowledgeItem[] = [];

    for (const artifact of artifacts) {
      // 解析PRD内容
      const parsed = await this.parsePRD(artifact.content);

      // 提取元数据
      const metadata = await this.extractMetadata(artifact, parsed);

      // 质量评估
      const quality = await this.qualityAnalyzer.analyze(artifact.content);

      // 提取标签
      const tags = this.extractTags(parsed);

      items.push({
        id: generateId(),
        type: KnowledgeType.PRD,
        title: parsed.title || artifact.name,
        content: artifact.content,
        source: {
          ...source,
          type: 'artifact',
          id: artifact.id
        },
        metadata,
        quality,
        tags,
        createdAt: artifact.createdAt
      });
    }

    return items;
  }

  async validate(item: KnowledgeItem): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查必要字段
    if (!item.title) {
      errors.push('缺少标题');
    }

    if (!item.content || item.content.length < 100) {
      warnings.push('内容过短，可能不完整');
    }

    // 检查格式
    if (!this.isValidMarkdown(item.content)) {
      warnings.push('Markdown格式不规范');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async extractMetadata(
    artifact: any,
    parsed: any
  ): Promise<KnowledgeMetadata> {
    return {
      author: artifact.createdBy,
      projectId: artifact.projectId,
      projectName: await this.getProjectName(artifact.projectId),
      domain: parsed.domain,
      techStack: parsed.techRequirements,
      scale: this.inferScale(parsed),
      completeness: this.calculateCompleteness(parsed),
      custom: {
        userStories: parsed.userStories?.length || 0,
        requirements: parsed.functionalRequirements?.length || 0
      }
    };
  }

  private async parsePRD(content: string): Promise<any> {
    // 解析PRD结构
    const sections = this.extractSections(content);
    return {
      title: this.extractTitle(content),
      overview: sections['产品概述'] || sections['Product Overview'],
      userStories: this.extractUserStories(sections),
      functionalRequirements: this.extractRequirements(sections),
      techRequirements: this.extractTechStack(sections),
      domain: this.identifyDomain(content)
    };
  }

  private extractTags(parsed: any): string[] {
    const tags: Set<string> = new Set(['PRD']);

    // 添加领域标签
    if (parsed.domain) {
      tags.add(parsed.domain);
    }

    // 添加技术栈标签
    if (parsed.techRequirements) {
      parsed.techRequirements.forEach((tech: string) => tags.add(tech));
    }

    return Array.from(tags);
  }

  private extractSections(content: string): Record<string, string> {
    // TODO: 实现章节提取
    return {};
  }

  private extractTitle(content: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : '';
  }

  private extractUserStories(sections: any): any[] {
    // TODO: 实现用户故事提取
    return [];
  }

  private extractRequirements(sections: any): any[] {
    // TODO: 实现需求提取
    return [];
  }

  private extractTechStack(sections: any): string[] {
    // TODO: 实现技术栈提取
    return [];
  }

  private identifyDomain(content: string): string {
    // TODO: 实现领域识别
    return '';
  }

  private isValidMarkdown(content: string): boolean {
    // TODO: 实现Markdown验证
    return true;
  }

  private async getProjectName(projectId: string): Promise<string> {
    const project = await this.db.projects.findUnique({ where: { id: projectId } });
    return project?.name || '';
  }

  private inferScale(parsed: any): 'small' | 'medium' | 'large' {
    const storyCount = parsed.userStories?.length || 0;
    if (storyCount < 5) return 'small';
    if (storyCount < 15) return 'medium';
    return 'large';
  }

  private calculateCompleteness(parsed: any): number {
    let score = 0;
    if (parsed.overview) score += 20;
    if (parsed.userStories?.length > 0) score += 30;
    if (parsed.functionalRequirements?.length > 0) score += 30;
    if (parsed.techRequirements?.length > 0) score += 20;
    return score;
  }
}
```

### 代码采集器实现

```typescript
/**
 * 代码采集器
 */
class CodeCollector implements IKnowledgeCollector {
  readonly id = 'code-collector';
  readonly name = '代码采集器';
  readonly supportedTypes = [KnowledgeType.CODE];

  constructor(
    private db: Database,
    private codeAnalyzer: CodeAnalyzer
  ) {}

  async collect(source: KnowledgeSource): Promise<KnowledgeItem[]> {
    // 获取项目所有代码文件
    const files = await this.db.projectFiles.findMany({
      where: { projectId: source.projectId }
    });

    const items: KnowledgeItem[] = [];

    for (const file of files) {
      // 过滤掉测试文件、配置文件等
      if (!this.shouldCollect(file)) {
        continue;
      }

      // 分析代码
      const analysis = await this.codeAnalyzer.analyze(file.content, file.language);

      // 提取函数、类等
      const entities = this.extractCodeEntities(file, analysis);

      for (const entity of entities) {
        items.push({
          id: generateId(),
          type: KnowledgeType.CODE,
          title: `${file.path}::${entity.name}`,
          content: entity.code,
          source: {
            ...source,
            type: 'artifact',
            id: file.id
          },
          metadata: {
            projectId: file.projectId,
            language: file.language,
            framework: analysis.framework,
            patterns: entity.patterns,
            complexity: entity.complexity,
            dependencies: entity.dependencies,
            custom: {
              functionType: entity.type,
              loc: entity.linesOfCode,
              cyclomaticComplexity: entity.cyclomaticComplexity
            }
          },
          quality: this.assessCodeQuality(entity, analysis),
          tags: this.generateCodeTags(file, entity),
          createdAt: file.createdAt
        });
      }
    }

    return items;
  }

  private shouldCollect(file: any): boolean {
    // 排除测试文件
    if (file.path.includes('.test.') || file.path.includes('.spec.')) {
      return false;
    }

    // 排除配置文件
    const configFiles = [
      'package.json', 'tsconfig.json', '.eslintrc', 'webpack.config.js'
    ];
    if (configFiles.some(cf => file.path.endsWith(cf))) {
      return false;
    }

    // 只采集源代码
    const codeExtensions = ['.ts', '.js', '.py', '.java', '.go', '.rs'];
    return codeExtensions.some(ext => file.path.endsWith(ext));
  }

  private extractCodeEntities(file: any, analysis: any): CodeEntity[] {
    const entities: CodeEntity[] = [];

    // 提取函数
    if (analysis.functions) {
      analysis.functions.forEach((fn: any) => {
        entities.push({
          type: 'function',
          name: fn.name,
          code: fn.code,
          patterns: fn.patterns,
          complexity: fn.complexity,
          dependencies: fn.dependencies,
          linesOfCode: fn.loc,
          cyclomaticComplexity: fn.cyclomaticComplexity
        });
      });
    }

    // 提取类
    if (analysis.classes) {
      analysis.classes.forEach((cls: any) => {
        entities.push({
          type: 'class',
          name: cls.name,
          code: cls.code,
          patterns: cls.patterns,
          complexity: cls.complexity,
          dependencies: cls.dependencies,
          linesOfCode: cls.loc,
          cyclomaticComplexity: cls.cyclomaticComplexity
        });
      });
    }

    return entities;
  }

  private assessCodeQuality(entity: CodeEntity, analysis: any): QualityScore {
    let overall = 80;

    // 复杂度惩罚
    if (entity.cyclomaticComplexity > 10) {
      overall -= (entity.cyclomaticComplexity - 10) * 2;
    }

    // 长度惩罚
    if (entity.linesOfCode > 100) {
      overall -= (entity.linesOfCode - 100) / 10;
    }

    // 模式加分
    if (entity.patterns && entity.patterns.length > 0) {
      overall += entity.patterns.length * 5;
    }

    return {
      overall: Math.max(0, Math.min(100, overall)),
      completeness: 90,
      accuracy: 85,
      clarity: this.assessClarity(entity),
      usefulness: this.assessUsefulness(entity),
      timeliness: 100
    };
  }

  private assessClarity(entity: CodeEntity): number {
    // 基于注释、命名等评估清晰度
    return 75;
  }

  private assessUsefulness(entity: CodeEntity): number {
    // 基于复用性、通用性评估实用性
    return 70;
  }

  private generateCodeTags(file: any, entity: CodeEntity): string[] {
    const tags: Set<string> = new Set(['代码']);

    tags.add(file.language);
    tags.add(entity.type);

    if (entity.patterns) {
      entity.patterns.forEach((p: string) => tags.add(p));
    }

    return Array.from(tags);
  }

  async validate(item: KnowledgeItem): Promise<ValidationResult> {
    return { valid: true, errors: [], warnings: [] };
  }

  async extractMetadata(item: KnowledgeItem): Promise<KnowledgeMetadata> {
    return item.metadata;
  }
}

interface CodeEntity {
  type: 'function' | 'class' | 'interface' | 'type';
  name: string;
  code: string;
  patterns?: string[];
  complexity: number;
  dependencies: string[];
  linesOfCode: number;
  cyclomaticComplexity: number;
}
```

### 采集器注册与调度

```typescript
/**
 * 知识采集管理器
 */
class KnowledgeCollectorManager {
  private collectors: Map<string, IKnowledgeCollector> = new Map();
  private queue: Queue;

  constructor(
    private knowledgeService: KnowledgeService,
    private eventBus: EventBus
  ) {
    this.queue = new Queue('knowledge-collection');
    this.setupEventListeners();
  }

  /**
   * 注册采集器
   */
  register(collector: IKnowledgeCollector): void {
    this.collectors.set(collector.id, collector);
  }

  /**
   * 触发采集
   */
  async triggerCollection(source: KnowledgeSource): Promise<void> {
    await this.queue.add('collect', {
      source,
      timestamp: new Date()
    });
  }

  /**
   * 执行采集任务
   */
  private async executeCollection(source: KnowledgeSource): Promise<void> {
    const allItems: KnowledgeItem[] = [];

    // 遍历所有采集器
    for (const collector of this.collectors.values()) {
      try {
        const items = await collector.collect(source);

        // 验证知识质量
        const validItems = await this.validateItems(items, collector);

        allItems.push(...validItems);
      } catch (error) {
        console.error(`Collector ${collector.id} failed:`, error);
      }
    }

    // 批量保存到知识库
    if (allItems.length > 0) {
      await this.knowledgeService.batchIndex(allItems);
    }
  }

  /**
   * 验证知识项
   */
  private async validateItems(
    items: KnowledgeItem[],
    collector: IKnowledgeCollector
  ): Promise<KnowledgeItem[]> {
    const validItems: KnowledgeItem[] = [];

    for (const item of items) {
      const result = await collector.validate(item);

      if (result.valid) {
        validItems.push(item);
      } else {
        console.warn(`Invalid knowledge item: ${item.id}`, result.errors);
      }
    }

    return validItems;
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    // 监听项目完成事件
    this.eventBus.on('project:completed', async (event) => {
      await this.triggerCollection({
        type: 'project',
        id: event.projectId,
        projectId: event.projectId,
        timestamp: new Date()
      });
    });

    // 监听文档审核通过事件
    this.eventBus.on('artifact:approved', async (event) => {
      await this.triggerCollection({
        type: 'artifact',
        id: event.artifactId,
        projectId: event.projectId,
        timestamp: new Date()
      });
    });

    // 监听用户标记最佳实践事件
    this.eventBus.on('knowledge:marked-as-best-practice', async (event) => {
      await this.triggerCollection({
        type: 'user_action',
        id: event.itemId,
        userId: event.userId,
        timestamp: new Date()
      });
    });
  }
}
```

---

## 🔄 与RagFlow集成

### RagFlow集成架构

```typescript
/**
 * RagFlow适配器
 */
class RagFlowAdapter {
  private client: RagFlowClient;
  private config: RagFlowConfig;

  constructor(config: RagFlowConfig) {
    this.config = config;
    this.client = new RagFlowClient({
      endpoint: config.endpoint,
      apiKey: config.apiKey
    });
  }

  /**
   * 创建知识库
   */
  async createKnowledgeBase(name: string, config: any): Promise<string> {
    const response = await this.client.post('/api/v1/knowledge-bases', {
      name,
      embedding_model: config.embeddingModel || 'text-embedding-3-small',
      chunk_method: config.chunkMethod || 'naive',
      chunk_size: config.chunkSize || 512,
      chunk_overlap: config.chunkOverlap || 50,
      language: config.language || 'Chinese'
    });

    return response.data.id;
  }

  /**
   * 上传文档
   */
  async uploadDocument(
    knowledgeBaseId: string,
    document: KnowledgeDocument
  ): Promise<string> {
    // 将知识项转换为RagFlow文档格式
    const ragflowDoc = this.convertToRagFlowDocument(document);

    const response = await this.client.post(
      `/api/v1/knowledge-bases/${knowledgeBaseId}/documents`,
      ragflowDoc
    );

    return response.data.document_id;
  }

  /**
   * 批量索引文档
   */
  async batchIndex(
    knowledgeBaseId: string,
    items: KnowledgeItem[]
  ): Promise<BatchIndexResult> {
    const documents = items.map(item => this.convertToRagFlowDocument({
      id: item.id,
      title: item.title,
      content: item.content,
      metadata: item.metadata,
      tags: item.tags
    }));

    const response = await this.client.post(
      `/api/v1/knowledge-bases/${knowledgeBaseId}/documents/batch`,
      { documents }
    );

    return {
      total: items.length,
      success: response.data.success_count,
      failed: response.data.failed_count,
      errors: response.data.errors
    };
  }

  /**
   * 检索文档
   */
  async retrieve(
    knowledgeBaseId: string,
    query: string,
    options?: RetrieveOptions
  ): Promise<RetrieveResult[]> {
    const response = await this.client.post(
      `/api/v1/knowledge-bases/${knowledgeBaseId}/retrieve`,
      {
        query,
        top_k: options?.topK || 5,
        similarity_threshold: options?.similarityThreshold || 0.7,
        filters: options?.filters
      }
    );

    return response.data.results.map((r: any) => ({
      documentId: r.document_id,
      chunkId: r.chunk_id,
      content: r.content,
      score: r.score,
      metadata: r.metadata
    }));
  }

  /**
   * 问答
   */
  async ask(
    knowledgeBaseId: string,
    question: string,
    options?: AskOptions
  ): Promise<AskResult> {
    const response = await this.client.post(
      `/api/v1/knowledge-bases/${knowledgeBaseId}/ask`,
      {
        question,
        model: options?.model || 'gpt-3.5-turbo',
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1024,
        stream: options?.stream || false,
        conversation_id: options?.conversationId
      }
    );

    return {
      answer: response.data.answer,
      references: response.data.references,
      conversationId: response.data.conversation_id,
      tokensUsed: response.data.usage?.total_tokens
    };
  }

  /**
   * 删除文档
   */
  async deleteDocument(
    knowledgeBaseId: string,
    documentId: string
  ): Promise<void> {
    await this.client.delete(
      `/api/v1/knowledge-bases/${knowledgeBaseId}/documents/${documentId}`
    );
  }

  /**
   * 更新文档
   */
  async updateDocument(
    knowledgeBaseId: string,
    documentId: string,
    updates: Partial<KnowledgeDocument>
  ): Promise<void> {
    await this.client.patch(
      `/api/v1/knowledge-bases/${knowledgeBaseId}/documents/${documentId}`,
      updates
    );
  }

  /**
   * 转换为RagFlow文档格式
   */
  private convertToRagFlowDocument(doc: KnowledgeDocument): any {
    return {
      name: doc.title,
      content: doc.content,
      metadata: {
        ...doc.metadata,
        tags: doc.tags?.join(','),
        source: 'ai-workbench',
        doc_id: doc.id
      }
    };
  }
}

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

interface RetrieveOptions {
  topK?: number;
  similarityThreshold?: number;
  filters?: Record<string, any>;
}

interface RetrieveResult {
  documentId: string;
  chunkId: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

interface AskOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  conversationId?: string;
}

interface AskResult {
  answer: string;
  references: RetrieveResult[];
  conversationId: string;
  tokensUsed?: number;
}

interface BatchIndexResult {
  total: number;
  success: number;
  failed: number;
  errors?: any[];
}
```

### 知识服务层

```typescript
/**
 * 知识服务
 */
class KnowledgeService {
  private ragflowAdapter: RagFlowAdapter;
  private db: Database;
  private knowledgeBaseId: string;

  constructor(
    ragflowAdapter: RagFlowAdapter,
    db: Database,
    config: KnowledgeServiceConfig
  ) {
    this.ragflowAdapter = ragflowAdapter;
    this.db = db;
    this.knowledgeBaseId = config.knowledgeBaseId;
  }

  /**
   * 索引单个知识项
   */
  async indexKnowledge(item: KnowledgeItem): Promise<void> {
    // 保存到本地数据库
    await this.db.knowledgeItems.create({
      data: {
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content,
        metadata: item.metadata,
        quality: item.quality,
        tags: item.tags,
        ragflowDocId: null, // 稍后更新
        createdAt: item.createdAt
      }
    });

    // 上传到RagFlow
    const docId = await this.ragflowAdapter.uploadDocument(
      this.knowledgeBaseId,
      {
        id: item.id,
        title: item.title,
        content: item.content,
        metadata: item.metadata,
        tags: item.tags
      }
    );

    // 更新RagFlow文档ID
    await this.db.knowledgeItems.update({
      where: { id: item.id },
      data: { ragflowDocId: docId }
    });
  }

  /**
   * 批量索引
   */
  async batchIndex(items: KnowledgeItem[]): Promise<void> {
    // 批量保存到数据库
    await this.db.knowledgeItems.createMany({
      data: items.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content,
        metadata: item.metadata,
        quality: item.quality,
        tags: item.tags,
        createdAt: item.createdAt
      }))
    });

    // 批量上传到RagFlow
    const result = await this.ragflowAdapter.batchIndex(
      this.knowledgeBaseId,
      items
    );

    console.log(`Indexed ${result.success}/${result.total} items`);
  }

  /**
   * 智能检索
   */
  async search(
    query: string,
    filters?: SearchFilters
  ): Promise<SearchResult[]> {
    // 构建RagFlow过滤器
    const ragflowFilters = this.buildRagFlowFilters(filters);

    // 调用RagFlow检索
    const results = await this.ragflowAdapter.retrieve(
      this.knowledgeBaseId,
      query,
      {
        topK: filters?.limit || 10,
        similarityThreshold: filters?.minScore || 0.7,
        filters: ragflowFilters
      }
    );

    // 转换结果
    return results.map(r => ({
      id: r.metadata.doc_id,
      title: r.metadata.title,
      content: r.content,
      score: r.score,
      metadata: r.metadata,
      highlight: this.extractHighlight(r.content, query)
    }));
  }

  /**
   * 智能问答
   */
  async ask(
    question: string,
    context?: AskContext
  ): Promise<AskResponse> {
    const result = await this.ragflowAdapter.ask(
      this.knowledgeBaseId,
      question,
      {
        model: context?.model || 'gpt-3.5-turbo',
        conversationId: context?.conversationId
      }
    );

    // 记录问答历史
    await this.db.qaHistory.create({
      data: {
        question,
        answer: result.answer,
        conversationId: result.conversationId,
        references: result.references,
        tokensUsed: result.tokensUsed,
        userId: context?.userId,
        createdAt: new Date()
      }
    });

    return {
      answer: result.answer,
      references: result.references.map(r => ({
        id: r.metadata.doc_id,
        title: r.metadata.title,
        snippet: r.content,
        score: r.score
      })),
      conversationId: result.conversationId
    };
  }

  /**
   * 推荐相关知识
   */
  async recommend(
    projectId: string,
    limit: number = 5
  ): Promise<KnowledgeRecommendation[]> {
    // 获取项目信息
    const project = await this.db.projects.findUnique({
      where: { id: projectId }
    });

    // 构建推荐查询
    const query = this.buildRecommendationQuery(project);

    // 检索相似项目的知识
    const results = await this.search(query, {
      limit,
      filters: {
        types: [KnowledgeType.BEST_PRACTICE, KnowledgeType.CODE],
        minQuality: 70
      }
    });

    return results.map(r => ({
      id: r.id,
      title: r.title,
      snippet: r.content.substring(0, 200),
      relevance: r.score,
      reason: this.explainRecommendation(r, project)
    }));
  }

  /**
   * 查找相似项目
   */
  async findSimilarProjects(projectId: string): Promise<SimilarProject[]> {
    const project = await this.db.projects.findUnique({
      where: { id: projectId },
      include: { artifacts: true }
    });

    // 提取项目特征
    const features = await this.extractProjectFeatures(project);

    // 向量检索相似项目
    const query = `${features.description} ${features.techStack.join(' ')}`;

    const results = await this.search(query, {
      limit: 10,
      filters: {
        types: [KnowledgeType.PRD, KnowledgeType.ARCHITECTURE]
      }
    });

    // 按项目ID分组
    const projectMap = new Map<string, any>();
    results.forEach(r => {
      const pid = r.metadata.projectId;
      if (pid && pid !== projectId) {
        if (!projectMap.has(pid)) {
          projectMap.set(pid, {
            projectId: pid,
            score: 0,
            count: 0,
            knowledge: []
          });
        }
        const p = projectMap.get(pid)!;
        p.score += r.score;
        p.count += 1;
        p.knowledge.push(r);
      }
    });

    // 排序并返回
    return Array.from(projectMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(p => ({
        projectId: p.projectId,
        similarityScore: p.score / p.count,
        sharedKnowledge: p.knowledge.length,
        relevantKnowledge: p.knowledge.slice(0, 3)
      }));
  }

  private buildRagFlowFilters(filters?: SearchFilters): any {
    if (!filters) return undefined;

    const ragflowFilters: any = {};

    if (filters.types) {
      ragflowFilters.type = { $in: filters.types };
    }

    if (filters.tags) {
      ragflowFilters.tags = { $in: filters.tags };
    }

    if (filters.projectId) {
      ragflowFilters.projectId = filters.projectId;
    }

    if (filters.minQuality) {
      ragflowFilters['quality.overall'] = { $gte: filters.minQuality };
    }

    return Object.keys(ragflowFilters).length > 0 ? ragflowFilters : undefined;
  }

  private extractHighlight(content: string, query: string): string {
    // 简单的高亮提取
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) {
      return content.substring(0, 200);
    }

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    return content.substring(start, end);
  }

  private buildRecommendationQuery(project: any): string {
    return `${project.description} ${project.techStack || ''}`;
  }

  private explainRecommendation(result: SearchResult, project: any): string {
    return `与您的项目在技术栈和业务场景上相似度较高`;
  }

  private async extractProjectFeatures(project: any): Promise<any> {
    // TODO: 实现项目特征提取
    return {
      description: project.description,
      techStack: []
    };
  }
}

interface SearchFilters {
  types?: KnowledgeType[];
  tags?: string[];
  projectId?: string;
  minQuality?: number;
  limit?: number;
  minScore?: number;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  metadata: any;
  highlight?: string;
}

interface AskContext {
  userId?: string;
  conversationId?: string;
  model?: string;
}

interface AskResponse {
  answer: string;
  references: Reference[];
  conversationId: string;
}

interface Reference {
  id: string;
  title: string;
  snippet: string;
  score: number;
}

interface KnowledgeRecommendation {
  id: string;
  title: string;
  snippet: string;
  relevance: number;
  reason: string;
}

interface SimilarProject {
  projectId: string;
  similarityScore: number;
  sharedKnowledge: number;
  relevantKnowledge: any[];
}
```

---

## 🎨 用户界面设计

### 知识搜索界面

```typescript
/**
 * 知识搜索组件
 */
const KnowledgeSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await knowledgeService.search(query, filters);
      setResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="knowledge-search">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        placeholder="搜索项目知识、代码片段、最佳实践..."
      />

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        types={[
          { value: 'prd', label: 'PRD文档' },
          { value: 'code', label: '代码' },
          { value: 'architecture', label: '架构设计' },
          { value: 'best_practice', label: '最佳实践' }
        ]}
      />

      <SearchResults
        results={results}
        loading={loading}
        onSelectResult={(result) => {
          // 打开详情页
        }}
      />
    </div>
  );
};
```

### 智能问答界面

```typescript
/**
 * 智能问答组件
 */
const KnowledgeChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setLoading(true);
    try {
      // 调用问答API
      const response = await knowledgeService.ask(input, {
        conversationId
      });

      // 添加AI回复
      const aiMessage: Message = {
        role: 'assistant',
        content: response.answer,
        references: response.references,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      setConversationId(response.conversationId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="knowledge-chat">
      <ChatHeader title="知识库问答" />

      <MessageList messages={messages} />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        loading={loading}
        placeholder="向知识库提问，例如：如何实现用户认证？"
      />

      {/* 快捷问题 */}
      <QuickQuestions
        questions={[
          '这个项目使用了哪些设计模式？',
          '如何优化数据库查询性能？',
          '有哪些推荐的前端架构？'
        ]}
        onSelect={(q) => setInput(q)}
      />
    </div>
  );
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  references?: Reference[];
  timestamp: Date;
}
```

### 知识推荐侧边栏

```typescript
/**
 * 知识推荐组件
 */
const KnowledgeRecommendations: React.FC<{ projectId: string }> = ({
  projectId
}) => {
  const [recommendations, setRecommendations] = useState<KnowledgeRecommendation[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, [projectId]);

  const loadRecommendations = async () => {
    const data = await knowledgeService.recommend(projectId, 5);
    setRecommendations(data);
  };

  return (
    <div className="knowledge-recommendations">
      <h3>相关知识推荐</h3>

      {recommendations.map(rec => (
        <RecommendationCard
          key={rec.id}
          title={rec.title}
          snippet={rec.snippet}
          relevance={rec.relevance}
          reason={rec.reason}
          onClick={() => {
            // 打开详情
          }}
        />
      ))}

      <Button onClick={loadRecommendations}>
        刷新推荐
      </Button>
    </div>
  );
};
```

---

## 🔄 实时同步机制

### 增量同步设计

```typescript
/**
 * 知识同步服务
 */
class KnowledgeSyncService {
  private db: Database;
  private ragflowAdapter: RagFlowAdapter;
  private knowledgeBaseId: string;
  private syncInterval: number = 300000; // 5分钟

  constructor(
    db: Database,
    ragflowAdapter: RagFlowAdapter,
    knowledgeBaseId: string
  ) {
    this.db = db;
    this.ragflowAdapter = ragflowAdapter;
    this.knowledgeBaseId = knowledgeBaseId;
  }

  /**
   * 启动定期同步
   */
  startPeriodicSync(): void {
    setInterval(async () => {
      await this.syncPendingItems();
    }, this.syncInterval);
  }

  /**
   * 同步待处理项
   */
  async syncPendingItems(): Promise<void> {
    // 获取待同步的知识项
    const pendingItems = await this.db.knowledgeItems.findMany({
      where: {
        OR: [
          { ragflowDocId: null },
          { syncStatus: 'pending' }
        ]
      },
      take: 100
    });

    if (pendingItems.length === 0) {
      return;
    }

    console.log(`Syncing ${pendingItems.length} knowledge items...`);

    for (const item of pendingItems) {
      try {
        if (!item.ragflowDocId) {
          // 新建
          const docId = await this.ragflowAdapter.uploadDocument(
            this.knowledgeBaseId,
            {
              id: item.id,
              title: item.title,
              content: item.content,
              metadata: item.metadata as any,
              tags: item.tags as string[]
            }
          );

          await this.db.knowledgeItems.update({
            where: { id: item.id },
            data: {
              ragflowDocId: docId,
              syncStatus: 'synced',
              syncedAt: new Date()
            }
          });
        } else {
          // 更新
          await this.ragflowAdapter.updateDocument(
            this.knowledgeBaseId,
            item.ragflowDocId,
            {
              title: item.title,
              content: item.content,
              metadata: item.metadata as any,
              tags: item.tags as string[]
            }
          );

          await this.db.knowledgeItems.update({
            where: { id: item.id },
            data: {
              syncStatus: 'synced',
              syncedAt: new Date()
            }
          });
        }
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);

        await this.db.knowledgeItems.update({
          where: { id: item.id },
          data: {
            syncStatus: 'failed',
            syncError: error.message
          }
        });
      }
    }

    console.log(`Sync completed`);
  }

  /**
   * 处理删除
   */
  async handleDelete(itemId: string): Promise<void> {
    const item = await this.db.knowledgeItems.findUnique({
      where: { id: itemId }
    });

    if (item?.ragflowDocId) {
      await this.ragflowAdapter.deleteDocument(
        this.knowledgeBaseId,
        item.ragflowDocId
      );
    }

    await this.db.knowledgeItems.delete({
      where: { id: itemId }
    });
  }

  /**
   * 处理更新
   */
  async handleUpdate(itemId: string, updates: any): Promise<void> {
    await this.db.knowledgeItems.update({
      where: { id: itemId },
      data: {
        ...updates,
        syncStatus: 'pending'
      }
    });
  }
}
```

### 变更检测与推送

```typescript
/**
 * 变更检测器
 */
class ChangeDetector {
  private eventBus: EventBus;
  private knowledgeSyncService: KnowledgeSyncService;

  constructor(
    eventBus: EventBus,
    knowledgeSyncService: KnowledgeSyncService
  ) {
    this.eventBus = eventBus;
    this.knowledgeSyncService = knowledgeSyncService;
    this.setupListeners();
  }

  private setupListeners(): void {
    // 监听文档创建
    this.eventBus.on('artifact:created', async (event) => {
      // 触发知识采集
      await this.triggerCollection(event);
    });

    // 监听文档更新
    this.eventBus.on('artifact:updated', async (event) => {
      await this.handleUpdate(event);
    });

    // 监听文档删除
    this.eventBus.on('artifact:deleted', async (event) => {
      await this.handleDelete(event);
    });

    // 监听用户反馈
    this.eventBus.on('feedback:submitted', async (event) => {
      await this.handleFeedback(event);
    });
  }

  private async triggerCollection(event: any): Promise<void> {
    // 实现采集逻辑
  }

  private async handleUpdate(event: any): Promise<void> {
    const knowledgeItem = await this.findKnowledgeItem(event.artifactId);
    if (knowledgeItem) {
      await this.knowledgeSyncService.handleUpdate(
        knowledgeItem.id,
        { content: event.newContent }
      );
    }
  }

  private async handleDelete(event: any): Promise<void> {
    const knowledgeItem = await this.findKnowledgeItem(event.artifactId);
    if (knowledgeItem) {
      await this.knowledgeSyncService.handleDelete(knowledgeItem.id);
    }
  }

  private async handleFeedback(event: any): Promise<void> {
    // 根据反馈调整知识质量评分
  }

  private async findKnowledgeItem(artifactId: string): Promise<any> {
    // TODO: 实现查找逻辑
    return null;
  }
}
```

---

## 📊 数据模型扩展

### 数据库Schema扩展

```sql
-- 知识项表
CREATE TABLE knowledge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  quality JSONB,
  tags TEXT[],

  -- 同步相关
  ragflow_doc_id VARCHAR(255),
  sync_status VARCHAR(50) DEFAULT 'pending',
  synced_at TIMESTAMP,
  sync_error TEXT,

  -- 来源信息
  source_type VARCHAR(50),
  source_id UUID,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),

  -- 统计信息
  view_count INTEGER DEFAULT 0,
  useful_count INTEGER DEFAULT 0,
  reference_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 问答历史表
CREATE TABLE qa_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  conversation_id VARCHAR(255),
  references JSONB,
  tokens_used INTEGER,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 知识使用记录表
CREATE TABLE knowledge_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id UUID REFERENCES knowledge_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50), -- view, useful, reference, copy
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 知识关系表
CREATE TABLE knowledge_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES knowledge_items(id) ON DELETE CASCADE,
  target_id UUID REFERENCES knowledge_items(id) ON DELETE CASCADE,
  relation_type VARCHAR(50), -- similar, derived, related, superseded
  strength DECIMAL(3, 2), -- 0.00 - 1.00
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_id, target_id, relation_type)
);

-- 索引
CREATE INDEX idx_knowledge_items_type ON knowledge_items(type);
CREATE INDEX idx_knowledge_items_project_id ON knowledge_items(project_id);
CREATE INDEX idx_knowledge_items_sync_status ON knowledge_items(sync_status);
CREATE INDEX idx_knowledge_items_tags ON knowledge_items USING GIN(tags);
CREATE INDEX idx_qa_history_user_id ON qa_history(user_id);
CREATE INDEX idx_qa_history_conversation_id ON qa_history(conversation_id);
CREATE INDEX idx_knowledge_usage_knowledge_id ON knowledge_usage(knowledge_id);
CREATE INDEX idx_knowledge_usage_user_id ON knowledge_usage(user_id);
```

---

## 🚀 实施路线图

### 阶段1：基础设施（第1-2周）

**目标：** 搭建知识库基础架构

- [ ] RagFlow环境部署
- [ ] 创建知识库实例
- [ ] 数据库Schema扩展
- [ ] 基础API开发

**交付物：**
- RagFlow可用实例
- 知识库数据模型
- 基础API接口

---

### 阶段2：知识采集（第3-4周）

**目标：** 实现核心采集器

- [ ] 实现IKnowledgeCollector接口
- [ ] PRD文档采集器
- [ ] 代码采集器
- [ ] 架构设计采集器
- [ ] 采集器注册和调度

**交付物：**
- 3个核心采集器
- 采集器管理系统
- 测试数据集

---

### 阶段3：RagFlow集成（第5-6周）

**目标：** 完成与RagFlow的集成

- [ ] RagFlow适配器开发
- [ ] 文档上传和索引
- [ ] 检索功能实现
- [ ] 问答功能实现
- [ ] 同步机制实现

**交付物：**
- RagFlow完整集成
- 同步服务
- 集成测试通过

---

### 阶段4：用户界面（第7-8周）

**目标：** 开发用户交互界面

- [ ] 知识搜索页面
- [ ] 智能问答聊天界面
- [ ] 知识推荐侧边栏
- [ ] 知识详情页
- [ ] 知识浏览器

**交付物：**
- 完整的知识库UI
- 用户体验优化
- 移动端适配

---

### 阶段5：优化与上线（第9-10周）

**目标：** 优化性能，准备上线

- [ ] 性能优化
- [ ] 搜索质量优化
- [ ] 知识质量评估
- [ ] 监控告警配置
- [ ] 用户培训文档

**交付物：**
- 性能优化报告
- 上线checklist
- 用户手册

---

## 💡 最佳实践建议

### 知识质量保障

1. **内容审核**：高价值知识需人工审核后再入库
2. **去重机制**：避免重复知识浪费存储和干扰检索
3. **质量评分**：建立多维度质量评估体系
4. **定期清理**：清除过时、低质量知识
5. **用户反馈**：允许用户标记知识是否有用

### 检索优化

1. **混合检索**：结合向量检索和关键词检索
2. **重排序**：使用业务规则对检索结果重排
3. **个性化**：根据用户历史调整检索权重
4. **上下文感知**：考虑用户当前项目上下文
5. **多模态**：支持代码、文档、图表等多种类型

### 成本控制

1. **缓存策略**：缓存常见问题的答案
2. **模型分级**：简单问题用小模型
3. **批量处理**：批量索引降低成本
4. **增量同步**：只同步变更部分
5. **用户限额**：限制免费用户调用频率

---

## 📈 监控指标

### 业务指标

| 指标 | 说明 | 目标值 |
|------|------|--------|
| 知识库规模 | 总知识条目数 | 10000+ |
| 日均检索量 | 每天检索次数 | 1000+ |
| 检索满意度 | 用户反馈满意比例 | ≥80% |
| 问答准确率 | 问答正确率 | ≥85% |
| 知识复用率 | 被引用的知识比例 | ≥30% |
| 平均响应时间 | 检索/问答响应时间 | <3s |

### 技术指标

| 指标 | 说明 | 目标值 |
|------|------|--------|
| 同步延迟 | 知识入库延迟 | <5min |
| 同步成功率 | 同步成功比例 | ≥99% |
| 检索准确率 | Top-5准确率 | ≥90% |
| 向量化耗时 | 文档向量化时间 | <10s |
| 缓存命中率 | 问答缓存命中率 | ≥40% |

---

## 🔒 安全与隐私

### 数据隔离

```typescript
/**
 * 权限过滤器
 */
class KnowledgePermissionFilter {
  async filterByPermission(
    items: KnowledgeItem[],
    userId: string
  ): Promise<KnowledgeItem[]> {
    return items.filter(item => {
      // 公开知识
      if (item.metadata.visibility === 'public') {
        return true;
      }

      // 团队知识
      if (item.metadata.visibility === 'team') {
        return this.isTeamMember(userId, item.metadata.teamId);
      }

      // 私有知识
      if (item.metadata.visibility === 'private') {
        return item.metadata.ownerId === userId;
      }

      return false;
    });
  }

  private isTeamMember(userId: string, teamId: string): boolean {
    // TODO: 检查团队成员关系
    return true;
  }
}
```

### 敏感信息过滤

```typescript
/**
 * 敏感信息过滤器
 */
class SensitiveInfoFilter {
  private patterns = [
    /api[_-]?key[:\s]*['"]?[\w-]+['"]?/gi,
    /password[:\s]*['"]?[\w-]+['"]?/gi,
    /token[:\s]*['"]?[\w-]+['"]?/gi,
    /secret[:\s]*['"]?[\w-]+['"]?/gi
  ];

  filter(content: string): string {
    let filtered = content;

    this.patterns.forEach(pattern => {
      filtered = filtered.replace(pattern, '[REDACTED]');
    });

    return filtered;
  }
}
```

---

## 📚 附录

### RagFlow API参考

```bash
# 创建知识库
POST /api/v1/knowledge-bases
{
  "name": "AI Workbench Knowledge Base",
  "embedding_model": "text-embedding-3-small",
  "chunk_method": "naive",
  "chunk_size": 512,
  "language": "Chinese"
}

# 上传文档
POST /api/v1/knowledge-bases/{kb_id}/documents
{
  "name": "PRD: Todo Application",
  "content": "...",
  "metadata": { ... }
}

# 检索
POST /api/v1/knowledge-bases/{kb_id}/retrieve
{
  "query": "如何实现用户认证",
  "top_k": 5,
  "similarity_threshold": 0.7
}

# 问答
POST /api/v1/knowledge-bases/{kb_id}/ask
{
  "question": "推荐的前端技术栈是什么？",
  "model": "gpt-3.5-turbo",
  "stream": false
}
```

### 配置示例

```yaml
# config/knowledge-base.yaml
knowledge_base:
  ragflow:
    endpoint: http://localhost:9380
    api_key: ${RAGFLOW_API_KEY}
    knowledge_base_id: ${KNOWLEDGE_BASE_ID}

  collection:
    enabled: true
    collectors:
      - id: prd-collector
        enabled: true
        priority: 1
      - id: code-collector
        enabled: true
        priority: 2
      - id: architecture-collector
        enabled: true
        priority: 1

  sync:
    interval: 300000  # 5分钟
    batch_size: 100
    retry_attempts: 3

  quality:
    min_score: 50
    auto_approve_threshold: 80

  search:
    default_top_k: 10
    similarity_threshold: 0.7
    enable_cache: true
    cache_ttl: 3600
```

### 术语表

| 术语 | 定义 |
|------|------|
| RagFlow | 开源的RAG(检索增强生成)引擎 |
| 知识项 | 知识库中的单个知识条目 |
| 向量化 | 将文本转换为向量表示的过程 |
| 语义检索 | 基于语义相似度的检索方式 |
| 分块 | 将长文档切分为小块的过程 |
| Embedding | 文本的向量表示 |

---

**最后更新：** 2025-11-17
**下次评审：** 2025-12-01
