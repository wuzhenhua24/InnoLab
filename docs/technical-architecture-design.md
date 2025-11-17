# AI研发工作台技术架构方案

## 📋 文档信息

**版本：** V1.0
**创建日期：** 2025-11-17
**最后更新：** 2025-11-17
**状态：** 设计阶段
**作者：** InnoLab Team

---

## 🎯 设计目标

### 核心目标

1. **MVP快速验证**：基于Claude Code SDK快速实现核心功能（PRD、代码、用例生成）
2. **架构灵活性**：支持未来替换为其他AI Agent（Claude Agent、Devin、AutoGPT等）
3. **可扩展性**：支持新增智能体类型和功能模块
4. **高性能**：支持并发请求，响应时间<5秒
5. **成本可控**：通过缓存、模型分级等手段控制AI调用成本

### 设计原则

- **抽象优于具体**：通过接口隔离具体实现
- **配置驱动**：核心逻辑通过配置控制，减少代码修改
- **插件化架构**：Agent、Prompt、工具均采用插件化设计
- **依赖注入**：解耦组件依赖关系
- **可观测性**：完整的日志、监控、追踪体系

---

## 🏗️ 整体架构设计

### 系统分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                      前端层 (Frontend)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  项目管理UI   │  │  流程编排UI   │  │  产出物查看   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    API网关层 (API Gateway)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  认证/鉴权    │  │  限流/熔断    │  │  请求路由     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    业务服务层 (Services)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  项目服务     │  │  工作流引擎   │  │  用户服务     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Agent抽象层 (Agent Abstraction Layer)           │
│                        [核心设计]                             │
│  ┌──────────────────────────────────────────────────┐       │
│  │           Agent Interface (统一接口)               │       │
│  └──────────────────────────────────────────────────┘       │
│         ↓              ↓              ↓              ↓       │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────┐     │
│  │Claude Code │ │Claude Agent│ │  AutoGPT   │ │ ...  │     │
│  │  Adapter   │ │  Adapter   │ │  Adapter   │ │      │     │
│  └────────────┘ └────────────┘ └────────────┘ └──────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  支撑服务层 (Supporting Services)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Prompt管理    │  │  缓存服务     │  │  文件服务     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  日志服务     │  │  监控服务     │  │  队列服务     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据层 (Data Layer)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  PostgreSQL  │  │   MongoDB     │  │    Redis     │       │
│  │  (元数据)     │  │ (文档/文件)   │  │  (缓存/队列)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Agent抽象层设计（核心）

### 设计思路

**关键思想：** 通过统一的Agent接口，隔离具体AI实现，使系统可以无缝切换不同的AI Agent。

### Agent接口定义

```typescript
/**
 * Agent抽象接口
 * 所有AI Agent适配器必须实现此接口
 */
interface IAgent {
  /**
   * Agent唯一标识符
   */
  readonly id: string;

  /**
   * Agent名称
   */
  readonly name: string;

  /**
   * Agent类型（claude-code-sdk, claude-agent, openai, custom等）
   */
  readonly type: AgentType;

  /**
   * Agent能力描述
   */
  readonly capabilities: AgentCapability[];

  /**
   * 初始化Agent
   */
  initialize(config: AgentConfig): Promise<void>;

  /**
   * 执行Agent任务
   * @param task 任务定义
   * @param context 执行上下文
   * @returns 执行结果
   */
  execute(task: AgentTask, context: ExecutionContext): Promise<AgentResult>;

  /**
   * 流式执行（支持实时输出）
   * @param task 任务定义
   * @param context 执行上下文
   * @param onChunk 数据块回调
   * @returns 执行结果
   */
  executeStream(
    task: AgentTask,
    context: ExecutionContext,
    onChunk: (chunk: AgentChunk) => void
  ): Promise<AgentResult>;

  /**
   * 取消执行
   */
  cancel(executionId: string): Promise<void>;

  /**
   * 获取执行状态
   */
  getStatus(executionId: string): Promise<ExecutionStatus>;

  /**
   * 健康检查
   */
  healthCheck(): Promise<HealthStatus>;

  /**
   * 销毁Agent（清理资源）
   */
  destroy(): Promise<void>;
}

/**
 * Agent类型枚举
 */
enum AgentType {
  CLAUDE_CODE_SDK = 'claude-code-sdk',
  CLAUDE_AGENT = 'claude-agent',
  OPENAI_ASSISTANT = 'openai-assistant',
  AUTOGPT = 'autogpt',
  CUSTOM = 'custom'
}

/**
 * Agent能力枚举
 */
enum AgentCapability {
  CODE_GENERATION = 'code_generation',
  PRD_GENERATION = 'prd_generation',
  TEST_GENERATION = 'test_generation',
  ARCHITECTURE_DESIGN = 'architecture_design',
  CODE_REVIEW = 'code_review',
  DEBUGGING = 'debugging',
  DOCUMENTATION = 'documentation'
}

/**
 * Agent任务定义
 */
interface AgentTask {
  id: string;
  type: TaskType;
  prompt: string | PromptTemplate;
  parameters: Record<string, any>;
  context?: TaskContext;
  constraints?: TaskConstraints;
}

/**
 * 任务类型
 */
enum TaskType {
  GENERATE_PRD = 'generate_prd',
  GENERATE_ARCHITECTURE = 'generate_architecture',
  GENERATE_CODE = 'generate_code',
  GENERATE_TEST = 'generate_test',
  REVIEW_CODE = 'review_code',
  FIX_BUG = 'fix_bug',
  GENERATE_DOCS = 'generate_docs'
}

/**
 * 执行上下文
 */
interface ExecutionContext {
  projectId: string;
  userId: string;
  workflowId?: string;
  nodeId?: string;
  parentExecutionId?: string;
  environment: Record<string, string>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

/**
 * Agent执行结果
 */
interface AgentResult {
  executionId: string;
  status: ExecutionStatus;
  output: AgentOutput;
  metadata: ExecutionMetadata;
  error?: AgentError;
}

/**
 * Agent输出
 */
interface AgentOutput {
  type: OutputType;
  content: string | object;
  artifacts?: Artifact[];
  recommendations?: string[];
}

/**
 * 输出类型
 */
enum OutputType {
  TEXT = 'text',
  JSON = 'json',
  CODE = 'code',
  MARKDOWN = 'markdown',
  STRUCTURED = 'structured'
}

/**
 * 执行元数据
 */
interface ExecutionMetadata {
  startTime: Date;
  endTime: Date;
  duration: number;
  tokensUsed?: number;
  cost?: number;
  model?: string;
  retryCount?: number;
}
```

### Agent注册中心

```typescript
/**
 * Agent注册中心
 * 管理所有可用的Agent适配器
 */
class AgentRegistry {
  private agents: Map<string, IAgent> = new Map();
  private capabilities: Map<AgentCapability, Set<string>> = new Map();

  /**
   * 注册Agent
   */
  register(agent: IAgent): void {
    this.agents.set(agent.id, agent);

    // 索引能力
    agent.capabilities.forEach(cap => {
      if (!this.capabilities.has(cap)) {
        this.capabilities.set(cap, new Set());
      }
      this.capabilities.get(cap)!.add(agent.id);
    });
  }

  /**
   * 注销Agent
   */
  unregister(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.capabilities.forEach(cap => {
        this.capabilities.get(cap)?.delete(agentId);
      });
      this.agents.delete(agentId);
    }
  }

  /**
   * 获取Agent
   */
  get(agentId: string): IAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * 根据能力查找Agent
   */
  findByCapability(capability: AgentCapability): IAgent[] {
    const agentIds = this.capabilities.get(capability);
    if (!agentIds) return [];

    return Array.from(agentIds)
      .map(id => this.agents.get(id))
      .filter((agent): agent is IAgent => agent !== undefined);
  }

  /**
   * 获取所有Agent
   */
  listAll(): IAgent[] {
    return Array.from(this.agents.values());
  }
}
```

### Agent工厂

```typescript
/**
 * Agent工厂
 * 根据配置创建Agent实例
 */
class AgentFactory {
  private registry: AgentRegistry;

  constructor(registry: AgentRegistry) {
    this.registry = registry;
  }

  /**
   * 创建Agent实例
   */
  async create(config: AgentConfig): Promise<IAgent> {
    const AgentClass = this.getAgentClass(config.type);
    const agent = new AgentClass(config);
    await agent.initialize(config);
    return agent;
  }

  /**
   * 根据类型获取Agent类
   */
  private getAgentClass(type: AgentType): typeof IAgent {
    switch (type) {
      case AgentType.CLAUDE_CODE_SDK:
        return ClaudeCodeSDKAdapter;
      case AgentType.CLAUDE_AGENT:
        return ClaudeAgentAdapter;
      case AgentType.OPENAI_ASSISTANT:
        return OpenAIAssistantAdapter;
      case AgentType.AUTOGPT:
        return AutoGPTAdapter;
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
  }
}
```

---

## 🤖 Claude Code SDK适配器实现

### 适配器架构

```typescript
/**
 * Claude Code SDK适配器
 * MVP阶段的主要Agent实现
 */
class ClaudeCodeSDKAdapter implements IAgent {
  readonly id: string;
  readonly name: string = 'Claude Code SDK';
  readonly type: AgentType = AgentType.CLAUDE_CODE_SDK;
  readonly capabilities: AgentCapability[] = [
    AgentCapability.CODE_GENERATION,
    AgentCapability.PRD_GENERATION,
    AgentCapability.TEST_GENERATION,
    AgentCapability.ARCHITECTURE_DESIGN,
    AgentCapability.CODE_REVIEW,
    AgentCapability.DEBUGGING,
    AgentCapability.DOCUMENTATION
  ];

  private sdk: ClaudeCodeSDK;
  private config: ClaudeCodeSDKConfig;
  private promptManager: PromptManager;
  private executionTracker: Map<string, ExecutionInfo> = new Map();

  constructor(config: ClaudeCodeSDKConfig) {
    this.id = config.id || `claude-code-sdk-${Date.now()}`;
    this.config = config;
  }

  async initialize(config: AgentConfig): Promise<void> {
    // 初始化Claude Code SDK
    this.sdk = new ClaudeCodeSDK({
      apiKey: config.apiKey,
      model: config.model || 'claude-sonnet-4.5',
      maxTokens: config.maxTokens || 4096,
      temperature: config.temperature || 0.7,
    });

    // 初始化Prompt管理器
    this.promptManager = new PromptManager(config.promptConfig);
    await this.promptManager.initialize();
  }

  async execute(
    task: AgentTask,
    context: ExecutionContext
  ): Promise<AgentResult> {
    const executionId = generateExecutionId();
    const startTime = new Date();

    try {
      // 记录执行信息
      this.executionTracker.set(executionId, {
        status: ExecutionStatus.RUNNING,
        startTime,
        task,
        context
      });

      // 构建Prompt
      const prompt = await this.buildPrompt(task);

      // 调用Claude Code SDK
      const response = await this.sdk.chat({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: this.getToolsForTask(task.type),
        system: this.getSystemPrompt(task.type),
      });

      // 解析响应
      const output = this.parseResponse(response, task.type);

      // 提取产出物
      const artifacts = this.extractArtifacts(response);

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // 计算成本
      const cost = this.calculateCost(response.usage);

      const result: AgentResult = {
        executionId,
        status: ExecutionStatus.COMPLETED,
        output: {
          type: this.getOutputType(task.type),
          content: output,
          artifacts
        },
        metadata: {
          startTime,
          endTime,
          duration,
          tokensUsed: response.usage.total_tokens,
          cost,
          model: this.config.model
        }
      };

      // 更新执行状态
      this.executionTracker.get(executionId)!.status = ExecutionStatus.COMPLETED;

      return result;

    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // 错误处理
      const agentError: AgentError = {
        code: 'EXECUTION_FAILED',
        message: error.message,
        stack: error.stack,
        retryable: this.isRetryableError(error)
      };

      this.executionTracker.get(executionId)!.status = ExecutionStatus.FAILED;

      return {
        executionId,
        status: ExecutionStatus.FAILED,
        output: { type: OutputType.TEXT, content: '' },
        metadata: {
          startTime,
          endTime,
          duration
        },
        error: agentError
      };
    }
  }

  async executeStream(
    task: AgentTask,
    context: ExecutionContext,
    onChunk: (chunk: AgentChunk) => void
  ): Promise<AgentResult> {
    const executionId = generateExecutionId();
    const startTime = new Date();

    const prompt = await this.buildPrompt(task);

    let fullResponse = '';
    const artifacts: Artifact[] = [];

    // 流式调用
    const stream = await this.sdk.chatStream({
      messages: [{ role: 'user', content: prompt }],
      tools: this.getToolsForTask(task.type),
      system: this.getSystemPrompt(task.type),
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        fullResponse += chunk.delta.text;
        onChunk({
          type: 'content',
          content: chunk.delta.text,
          timestamp: new Date()
        });
      }
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    return {
      executionId,
      status: ExecutionStatus.COMPLETED,
      output: {
        type: this.getOutputType(task.type),
        content: fullResponse,
        artifacts
      },
      metadata: {
        startTime,
        endTime,
        duration
      }
    };
  }

  async cancel(executionId: string): Promise<void> {
    const execution = this.executionTracker.get(executionId);
    if (execution) {
      execution.status = ExecutionStatus.CANCELLED;
      // TODO: 实现实际的取消逻辑
    }
  }

  async getStatus(executionId: string): Promise<ExecutionStatus> {
    return this.executionTracker.get(executionId)?.status || ExecutionStatus.UNKNOWN;
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      // 简单的健康检查：调用一个小请求
      await this.sdk.chat({
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 10
      });
      return { healthy: true, message: 'OK' };
    } catch (error) {
      return { healthy: false, message: error.message };
    }
  }

  async destroy(): Promise<void> {
    this.executionTracker.clear();
    // 清理其他资源
  }

  /**
   * 构建Prompt
   */
  private async buildPrompt(task: AgentTask): Promise<string> {
    if (typeof task.prompt === 'string') {
      return task.prompt;
    }

    // 使用Prompt模板
    return await this.promptManager.render(
      task.prompt as PromptTemplate,
      task.parameters
    );
  }

  /**
   * 获取任务相关的工具
   */
  private getToolsForTask(taskType: TaskType): any[] {
    const toolMap: Record<TaskType, string[]> = {
      [TaskType.GENERATE_CODE]: ['file_write', 'file_read', 'bash_execute'],
      [TaskType.GENERATE_PRD]: ['web_search', 'file_write'],
      [TaskType.GENERATE_TEST]: ['file_read', 'file_write', 'bash_execute'],
      [TaskType.GENERATE_ARCHITECTURE]: ['file_write', 'diagram_generate'],
      [TaskType.REVIEW_CODE]: ['file_read', 'static_analysis'],
      [TaskType.FIX_BUG]: ['file_read', 'file_write', 'bash_execute'],
      [TaskType.GENERATE_DOCS]: ['file_read', 'file_write']
    };

    const toolNames = toolMap[taskType] || [];
    return toolNames.map(name => this.getToolDefinition(name));
  }

  /**
   * 获取系统Prompt
   */
  private getSystemPrompt(taskType: TaskType): string {
    const systemPrompts: Record<TaskType, string> = {
      [TaskType.GENERATE_PRD]: `You are a professional product manager. Generate detailed and well-structured PRD documents.`,
      [TaskType.GENERATE_CODE]: `You are an expert software engineer. Write clean, efficient, and well-documented code.`,
      [TaskType.GENERATE_TEST]: `You are a QA engineer. Write comprehensive test cases with good coverage.`,
      [TaskType.GENERATE_ARCHITECTURE]: `You are a solutions architect. Design scalable and maintainable system architectures.`,
      [TaskType.REVIEW_CODE]: `You are a senior code reviewer. Provide constructive and detailed code review feedback.`,
      [TaskType.FIX_BUG]: `You are a debugging expert. Identify and fix bugs efficiently.`,
      [TaskType.GENERATE_DOCS]: `You are a technical writer. Create clear and comprehensive documentation.`
    };

    return systemPrompts[taskType] || 'You are a helpful AI assistant.';
  }

  /**
   * 解析响应
   */
  private parseResponse(response: any, taskType: TaskType): any {
    // 根据任务类型解析响应
    switch (taskType) {
      case TaskType.GENERATE_PRD:
        return this.parsePRDResponse(response);
      case TaskType.GENERATE_CODE:
        return this.parseCodeResponse(response);
      case TaskType.GENERATE_ARCHITECTURE:
        return this.parseArchitectureResponse(response);
      default:
        return response.content;
    }
  }

  /**
   * 提取产出物
   */
  private extractArtifacts(response: any): Artifact[] {
    const artifacts: Artifact[] = [];

    // 从响应中提取文件、代码块等
    if (response.tool_calls) {
      response.tool_calls.forEach((call: any) => {
        if (call.function.name === 'file_write') {
          const args = JSON.parse(call.function.arguments);
          artifacts.push({
            type: 'file',
            name: args.path,
            content: args.content,
            mimeType: this.getMimeType(args.path)
          });
        }
      });
    }

    return artifacts;
  }

  /**
   * 计算成本
   */
  private calculateCost(usage: any): number {
    // Claude Sonnet定价（示例）
    const inputCostPer1k = 0.003;
    const outputCostPer1k = 0.015;

    const inputCost = (usage.input_tokens / 1000) * inputCostPer1k;
    const outputCost = (usage.output_tokens / 1000) * outputCostPer1k;

    return inputCost + outputCost;
  }

  private getOutputType(taskType: TaskType): OutputType {
    const typeMap: Record<TaskType, OutputType> = {
      [TaskType.GENERATE_PRD]: OutputType.MARKDOWN,
      [TaskType.GENERATE_CODE]: OutputType.CODE,
      [TaskType.GENERATE_ARCHITECTURE]: OutputType.STRUCTURED,
      [TaskType.GENERATE_TEST]: OutputType.CODE,
      [TaskType.REVIEW_CODE]: OutputType.MARKDOWN,
      [TaskType.FIX_BUG]: OutputType.CODE,
      [TaskType.GENERATE_DOCS]: OutputType.MARKDOWN
    };

    return typeMap[taskType] || OutputType.TEXT;
  }

  private isRetryableError(error: any): boolean {
    // 判断错误是否可重试
    const retryableCodes = ['RATE_LIMIT', 'TIMEOUT', 'NETWORK_ERROR'];
    return retryableCodes.includes(error.code);
  }

  private getToolDefinition(toolName: string): any {
    // 返回工具定义
    // TODO: 实现工具定义
    return {};
  }

  private getMimeType(filePath: string): string {
    const ext = filePath.split('.').pop();
    const mimeTypes: Record<string, string> = {
      'js': 'application/javascript',
      'ts': 'application/typescript',
      'py': 'text/x-python',
      'md': 'text/markdown',
      'json': 'application/json',
      'html': 'text/html',
      'css': 'text/css'
    };
    return mimeTypes[ext || ''] || 'text/plain';
  }

  private parsePRDResponse(response: any): any {
    // 解析PRD响应
    // TODO: 实现PRD解析逻辑
    return response.content;
  }

  private parseCodeResponse(response: any): any {
    // 解析代码响应
    // TODO: 实现代码解析逻辑
    return response.content;
  }

  private parseArchitectureResponse(response: any): any {
    // 解析架构响应
    // TODO: 实现架构解析逻辑
    return response.content;
  }
}
```

---

## 📝 Prompt管理系统

### Prompt模板引擎

```typescript
/**
 * Prompt模板定义
 */
interface PromptTemplate {
  id: string;
  name: string;
  version: string;
  type: TaskType;
  template: string;
  variables: PromptVariable[];
  examples?: FewShotExample[];
  metadata?: Record<string, any>;
}

/**
 * Prompt变量
 */
interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  default?: any;
}

/**
 * Few-shot示例
 */
interface FewShotExample {
  input: Record<string, any>;
  output: string;
  explanation?: string;
}

/**
 * Prompt管理器
 */
class PromptManager {
  private templates: Map<string, PromptTemplate> = new Map();
  private cache: Map<string, string> = new Map();
  private config: PromptConfig;

  constructor(config: PromptConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // 从配置加载Prompt模板
    await this.loadTemplates();
  }

  /**
   * 注册Prompt模板
   */
  register(template: PromptTemplate): void {
    const key = `${template.id}:${template.version}`;
    this.templates.set(key, template);
  }

  /**
   * 获取Prompt模板
   */
  get(id: string, version?: string): PromptTemplate | undefined {
    const key = version ? `${id}:${version}` : this.getLatestVersion(id);
    return this.templates.get(key);
  }

  /**
   * 渲染Prompt
   */
  async render(
    template: PromptTemplate,
    variables: Record<string, any>
  ): Promise<string> {
    // 验证变量
    this.validateVariables(template, variables);

    // 渲染模板
    let rendered = template.template;

    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(
        new RegExp(`{{${key}}}`, 'g'),
        String(value)
      );
    }

    // 添加Few-shot示例
    if (template.examples && template.examples.length > 0) {
      const examplesText = this.renderExamples(template.examples);
      rendered = `${examplesText}\n\n${rendered}`;
    }

    return rendered;
  }

  /**
   * 验证变量
   */
  private validateVariables(
    template: PromptTemplate,
    variables: Record<string, any>
  ): void {
    template.variables.forEach(varDef => {
      if (varDef.required && !(varDef.name in variables)) {
        throw new Error(`Missing required variable: ${varDef.name}`);
      }
    });
  }

  /**
   * 渲染Few-shot示例
   */
  private renderExamples(examples: FewShotExample[]): string {
    return examples.map(ex => {
      const input = Object.entries(ex.input)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      return `Example:\nInput:\n${input}\nOutput:\n${ex.output}`;
    }).join('\n\n');
  }

  /**
   * 获取最新版本
   */
  private getLatestVersion(id: string): string {
    const versions = Array.from(this.templates.keys())
      .filter(key => key.startsWith(`${id}:`))
      .map(key => key.split(':')[1])
      .sort()
      .reverse();

    return versions.length > 0 ? `${id}:${versions[0]}` : '';
  }

  /**
   * 加载模板
   */
  private async loadTemplates(): Promise<void> {
    // 从文件系统或数据库加载模板
    // TODO: 实现加载逻辑
  }
}
```

### Prompt模板示例

```yaml
# prompts/generate_prd.yaml
id: generate_prd
name: PRD生成模板
version: "1.0.0"
type: GENERATE_PRD
template: |
  Please generate a detailed Product Requirements Document (PRD) based on the following requirement:

  Requirement: {{requirement}}

  The PRD should include:
  1. Product Overview
  2. User Stories (at least 3-5)
  3. Functional Requirements
  4. Non-Functional Requirements
  5. Technical Requirements
  6. Acceptance Criteria
  7. Success Metrics

  Additional Context: {{context}}

  Please structure the output in Markdown format with clear sections.

variables:
  - name: requirement
    type: string
    required: true
    description: The user's requirement description

  - name: context
    type: string
    required: false
    description: Additional context about the project
    default: ""

examples:
  - input:
      requirement: "Build a todo list application"
      context: "For individual users, mobile-first design"
    output: |
      # Product Requirements Document: Todo List Application

      ## 1. Product Overview
      A mobile-first todo list application for individual users...

      ## 2. User Stories
      - As a user, I want to create tasks...
      - As a user, I want to mark tasks as complete...

      ...
```

---

## 🔧 工作流引擎设计

### 工作流定义

```typescript
/**
 * 工作流定义
 */
interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  version: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables?: WorkflowVariable[];
  triggers?: WorkflowTrigger[];
}

/**
 * 工作流节点
 */
interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: NodeConfig;
  position?: { x: number; y: number };
}

/**
 * 节点类型
 */
enum NodeType {
  AGENT = 'agent',           // AI Agent节点
  HUMAN = 'human',           // 人工审核节点
  SCRIPT = 'script',         // 脚本执行节点
  CONDITION = 'condition',   // 条件判断节点
  PARALLEL = 'parallel',     // 并行执行节点
  INTEGRATION = 'integration' // 第三方集成节点
}

/**
 * 节点配置
 */
interface NodeConfig {
  // Agent节点配置
  agentId?: string;
  taskType?: TaskType;
  prompt?: string | PromptTemplate;
  parameters?: Record<string, any>;

  // 人工审核节点配置
  reviewers?: string[];
  approvalType?: 'any' | 'all';
  timeout?: number;

  // 脚本节点配置
  script?: string;
  language?: 'javascript' | 'python' | 'bash';

  // 条件节点配置
  condition?: string;

  // 通用配置
  retryPolicy?: RetryPolicy;
  timeout?: number;
  onError?: 'fail' | 'skip' | 'retry';
}

/**
 * 工作流边
 */
interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
  label?: string;
}

/**
 * 重试策略
 */
interface RetryPolicy {
  maxRetries: number;
  backoff: 'linear' | 'exponential';
  initialDelay: number;
  maxDelay?: number;
}
```

### 工作流引擎

```typescript
/**
 * 工作流引擎
 */
class WorkflowEngine {
  private agentRegistry: AgentRegistry;
  private executionStore: ExecutionStore;
  private eventBus: EventBus;

  constructor(
    agentRegistry: AgentRegistry,
    executionStore: ExecutionStore,
    eventBus: EventBus
  ) {
    this.agentRegistry = agentRegistry;
    this.executionStore = executionStore;
    this.eventBus = eventBus;
  }

  /**
   * 执行工作流
   */
  async execute(
    workflow: WorkflowDefinition,
    input: Record<string, any>,
    context: ExecutionContext
  ): Promise<WorkflowExecutionResult> {
    const executionId = generateExecutionId();

    // 创建执行记录
    const execution = await this.executionStore.create({
      id: executionId,
      workflowId: workflow.id,
      status: ExecutionStatus.RUNNING,
      input,
      context,
      startTime: new Date()
    });

    try {
      // 构建执行图
      const graph = this.buildExecutionGraph(workflow);

      // 拓扑排序
      const sortedNodes = this.topologicalSort(graph);

      // 执行节点
      const results: Map<string, any> = new Map();

      for (const nodeId of sortedNodes) {
        const node = workflow.nodes.find(n => n.id === nodeId)!;

        // 检查条件
        if (!this.shouldExecuteNode(node, results, workflow.edges)) {
          continue;
        }

        // 执行节点
        const nodeResult = await this.executeNode(node, results, context);
        results.set(nodeId, nodeResult);

        // 更新执行状态
        await this.executionStore.updateNodeStatus(
          executionId,
          nodeId,
          nodeResult.status
        );

        // 发送事件
        this.eventBus.emit('node:completed', {
          executionId,
          nodeId,
          result: nodeResult
        });

        // 如果节点失败且策略为fail，则中断
        if (nodeResult.status === ExecutionStatus.FAILED &&
            node.config.onError === 'fail') {
          throw new Error(`Node ${nodeId} failed`);
        }
      }

      // 完成执行
      const endTime = new Date();
      await this.executionStore.update(executionId, {
        status: ExecutionStatus.COMPLETED,
        endTime,
        output: this.collectOutput(results, workflow)
      });

      return {
        executionId,
        status: ExecutionStatus.COMPLETED,
        output: this.collectOutput(results, workflow),
        startTime: execution.startTime,
        endTime
      };

    } catch (error) {
      // 错误处理
      await this.executionStore.update(executionId, {
        status: ExecutionStatus.FAILED,
        error: error.message,
        endTime: new Date()
      });

      throw error;
    }
  }

  /**
   * 执行节点
   */
  private async executeNode(
    node: WorkflowNode,
    previousResults: Map<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    switch (node.type) {
      case NodeType.AGENT:
        return await this.executeAgentNode(node, previousResults, context);
      case NodeType.HUMAN:
        return await this.executeHumanNode(node, previousResults, context);
      case NodeType.SCRIPT:
        return await this.executeScriptNode(node, previousResults, context);
      case NodeType.CONDITION:
        return await this.executeConditionNode(node, previousResults, context);
      case NodeType.PARALLEL:
        return await this.executeParallelNode(node, previousResults, context);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  /**
   * 执行Agent节点
   */
  private async executeAgentNode(
    node: WorkflowNode,
    previousResults: Map<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    const agent = this.agentRegistry.get(node.config.agentId!);
    if (!agent) {
      throw new Error(`Agent not found: ${node.config.agentId}`);
    }

    // 构建任务
    const task: AgentTask = {
      id: generateTaskId(),
      type: node.config.taskType!,
      prompt: node.config.prompt!,
      parameters: this.resolveParameters(
        node.config.parameters || {},
        previousResults
      )
    };

    // 执行Agent
    return await agent.execute(task, context);
  }

  /**
   * 执行人工审核节点
   */
  private async executeHumanNode(
    node: WorkflowNode,
    previousResults: Map<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    // 创建审核任务
    const reviewTask = {
      nodeId: node.id,
      reviewers: node.config.reviewers!,
      content: previousResults,
      approvalType: node.config.approvalType || 'any',
      timeout: node.config.timeout
    };

    // 等待审核
    // TODO: 实现审核逻辑（可能需要通过事件机制）
    return { status: ExecutionStatus.WAITING_REVIEW };
  }

  /**
   * 解析参数（支持引用前置节点的输出）
   */
  private resolveParameters(
    parameters: Record<string, any>,
    previousResults: Map<string, any>
  ): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'string' && value.startsWith('$')) {
        // 引用语法：$nodeId.path
        const [nodeId, ...path] = value.substring(1).split('.');
        const nodeResult = previousResults.get(nodeId);
        resolved[key] = path.reduce((obj, p) => obj?.[p], nodeResult);
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  /**
   * 构建执行图
   */
  private buildExecutionGraph(workflow: WorkflowDefinition): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();

    workflow.nodes.forEach(node => {
      graph.set(node.id, new Set());
    });

    workflow.edges.forEach(edge => {
      graph.get(edge.source)!.add(edge.target);
    });

    return graph;
  }

  /**
   * 拓扑排序
   */
  private topologicalSort(graph: Map<string, Set<string>>): string[] {
    // TODO: 实现拓扑排序算法
    return Array.from(graph.keys());
  }

  /**
   * 判断是否应该执行节点
   */
  private shouldExecuteNode(
    node: WorkflowNode,
    results: Map<string, any>,
    edges: WorkflowEdge[]
  ): boolean {
    // 检查条件边
    const incomingEdges = edges.filter(e => e.target === node.id);

    for (const edge of incomingEdges) {
      if (edge.condition) {
        // 评估条件
        // TODO: 实现条件评估
      }
    }

    return true;
  }

  /**
   * 收集输出
   */
  private collectOutput(
    results: Map<string, any>,
    workflow: WorkflowDefinition
  ): any {
    // 收集最终输出节点的结果
    // TODO: 实现输出收集逻辑
    return Object.fromEntries(results);
  }

  private executeScriptNode(
    node: WorkflowNode,
    previousResults: Map<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    throw new Error('Not implemented');
  }

  private executeConditionNode(
    node: WorkflowNode,
    previousResults: Map<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    throw new Error('Not implemented');
  }

  private executeParallelNode(
    node: WorkflowNode,
    previousResults: Map<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    throw new Error('Not implemented');
  }
}
```

---

## 💾 数据模型设计

### 数据库Schema

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 项目表
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  workflow_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 工作流定义表
CREATE TABLE workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  version VARCHAR(20) NOT NULL,
  definition JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 工作流执行表
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES workflow_definitions(id),
  status VARCHAR(50) NOT NULL,
  input JSONB,
  output JSONB,
  error TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 节点执行表
CREATE TABLE node_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
  node_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  input JSONB,
  output JSONB,
  error TEXT,
  tokens_used INTEGER,
  cost DECIMAL(10, 4),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent配置表
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prompt模板表
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  version VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  template TEXT NOT NULL,
  variables JSONB,
  examples JSONB,
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, version)
);

-- 产出物表
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  execution_id UUID REFERENCES workflow_executions(id),
  node_id VARCHAR(100),
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  content TEXT,
  file_path VARCHAR(500),
  mime_type VARCHAR(100),
  size INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 成本记录表
CREATE TABLE cost_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  execution_id UUID REFERENCES workflow_executions(id),
  agent_type VARCHAR(50),
  model VARCHAR(100),
  tokens_used INTEGER,
  cost DECIMAL(10, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_workflow_executions_project_id ON workflow_executions(project_id);
CREATE INDEX idx_node_executions_execution_id ON node_executions(execution_id);
CREATE INDEX idx_artifacts_project_id ON artifacts(project_id);
CREATE INDEX idx_cost_records_user_id ON cost_records(user_id);
CREATE INDEX idx_cost_records_created_at ON cost_records(created_at);
```

### MongoDB集合设计

```javascript
// 项目文件集合
db.project_files.createIndex({ "projectId": 1 });
db.project_files.createIndex({ "path": 1 });

{
  _id: ObjectId(),
  projectId: UUID,
  path: String,
  content: String,
  language: String,
  size: Number,
  encoding: String,
  metadata: {
    generatedBy: String,
    nodeId: String,
    version: Number
  },
  createdAt: Date,
  updatedAt: Date
}

// 执行日志集合
db.execution_logs.createIndex({ "executionId": 1 });
db.execution_logs.createIndex({ "timestamp": 1 });

{
  _id: ObjectId(),
  executionId: UUID,
  nodeId: String,
  level: String, // 'info', 'warn', 'error', 'debug'
  message: String,
  details: Object,
  timestamp: Date
}

// 缓存集合
db.agent_cache.createIndex({ "promptHash": 1 });
db.agent_cache.createIndex({ "expiresAt": 1 });

{
  _id: ObjectId(),
  promptHash: String,
  agentType: String,
  taskType: String,
  parameters: Object,
  result: Object,
  tokensUsed: Number,
  cost: Number,
  hitCount: Number,
  createdAt: Date,
  expiresAt: Date
}
```

---

## 🔌 扩展性设计

### Agent适配器扩展

**添加新Agent步骤：**

1. **实现IAgent接口**

```typescript
class CustomAgentAdapter implements IAgent {
  readonly id: string = 'custom-agent';
  readonly name: string = 'Custom Agent';
  readonly type: AgentType = AgentType.CUSTOM;
  readonly capabilities: AgentCapability[] = [
    AgentCapability.CODE_GENERATION
  ];

  async initialize(config: AgentConfig): Promise<void> {
    // 初始化逻辑
  }

  async execute(task: AgentTask, context: ExecutionContext): Promise<AgentResult> {
    // 执行逻辑
  }

  // ... 实现其他方法
}
```

2. **注册Agent**

```typescript
// 在AgentFactory中注册
const factory = new AgentFactory(registry);
factory.registerAdapter(AgentType.CUSTOM, CustomAgentAdapter);

// 或通过配置文件
// config/agents.yaml
agents:
  - type: custom
    class: CustomAgentAdapter
    config:
      apiKey: xxx
```

3. **配置使用**

```yaml
# 工作流中使用
nodes:
  - id: custom_node
    type: agent
    config:
      agentId: custom-agent
      taskType: generate_code
```

### Prompt模板扩展

**添加新Prompt模板：**

```yaml
# prompts/custom_task.yaml
id: custom_task
name: 自定义任务模板
version: "1.0.0"
type: CUSTOM
template: |
  Your custom prompt template here...
  {{variable1}}
  {{variable2}}

variables:
  - name: variable1
    type: string
    required: true
  - name: variable2
    type: string
    required: false
    default: "default value"
```

### 工具扩展

**添加新工具：**

```typescript
interface ITool {
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute(params: Record<string, any>): Promise<ToolResult>;
}

class CustomTool implements ITool {
  name = 'custom_tool';
  description = 'Custom tool description';
  parameters = [
    { name: 'param1', type: 'string', required: true }
  ];

  async execute(params: Record<string, any>): Promise<ToolResult> {
    // 工具执行逻辑
    return {
      success: true,
      output: 'Tool execution result'
    };
  }
}

// 注册工具
const toolRegistry = new ToolRegistry();
toolRegistry.register(new CustomTool());
```

---

## 🛠️ 技术栈选型

### 后端技术栈

```yaml
语言与框架:
  - 语言: TypeScript
  - 运行时: Node.js 20+
  - 框架: NestJS (企业级Node.js框架)
  - API风格: RESTful + GraphQL (可选)

数据库:
  关系型:
    - PostgreSQL 15+
    - ORM: Prisma / TypeORM

  文档型:
    - MongoDB 6+
    - ODM: Mongoose

  缓存:
    - Redis 7+
    - 客户端: ioredis

消息队列:
  - BullMQ (基于Redis)
  - 用途: 异步任务、工作流调度

AI集成:
  - Claude Code SDK: @anthropic-ai/sdk
  - OpenAI SDK: openai
  - LangChain: langchain (可选，用于复杂编排)

文件存储:
  - 本地: 文件系统
  - 云端: AWS S3 / MinIO (自托管S3兼容)

实时通信:
  - WebSocket: Socket.io / ws
  - 服务端推送: Server-Sent Events (SSE)

监控与日志:
  - 日志: Winston / Pino
  - 监控: Prometheus + Grafana
  - 追踪: OpenTelemetry
  - APM: Elastic APM (可选)
```

### 前端技术栈

```yaml
框架与库:
  - 框架: React 18+
  - 语言: TypeScript
  - 构建工具: Vite
  - 路由: React Router v6

状态管理:
  - 全局状态: Zustand / Jotai
  - 服务端状态: TanStack Query (React Query)
  - 表单: React Hook Form

UI组件:
  - 组件库: Ant Design / shadcn/ui
  - 图标: Lucide React
  - 样式: Tailwind CSS
  - 动画: Framer Motion

可视化:
  - 流程图: ReactFlow
  - 图表: Recharts / ECharts
  - 代码编辑器: Monaco Editor (VS Code内核)
  - Markdown: react-markdown

开发工具:
  - 代码检查: ESLint
  - 格式化: Prettier
  - 类型检查: TypeScript
  - 测试: Vitest + Testing Library
```

### DevOps工具链

```yaml
版本控制:
  - Git
  - GitHub / GitLab

CI/CD:
  - GitHub Actions / GitLab CI
  - 流程: Lint → Test → Build → Deploy

容器化:
  - Docker
  - Docker Compose (本地开发)
  - Kubernetes (生产环境，可选)

部署:
  - 前端: Vercel / Netlify / Cloudflare Pages
  - 后端: AWS ECS / Google Cloud Run / 自托管VPS
  - 数据库: 托管服务 (AWS RDS, MongoDB Atlas)

监控告警:
  - Uptime: UptimeRobot / Pingdom
  - 错误追踪: Sentry
  - 日志聚合: Loki / ELK Stack
```

---

## 📦 项目结构

### Monorepo结构

```
ai-workbench/
├── packages/
│   ├── backend/                 # 后端服务
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── agent/      # Agent模块
│   │   │   │   │   ├── adapters/
│   │   │   │   │   │   ├── claude-code-sdk.adapter.ts
│   │   │   │   │   │   ├── claude-agent.adapter.ts
│   │   │   │   │   │   └── base.adapter.ts
│   │   │   │   │   ├── interfaces/
│   │   │   │   │   │   └── agent.interface.ts
│   │   │   │   │   ├── agent.module.ts
│   │   │   │   │   ├── agent.service.ts
│   │   │   │   │   └── agent.registry.ts
│   │   │   │   ├── workflow/   # 工作流模块
│   │   │   │   │   ├── workflow.engine.ts
│   │   │   │   │   ├── workflow.service.ts
│   │   │   │   │   └── workflow.module.ts
│   │   │   │   ├── project/    # 项目模块
│   │   │   │   ├── prompt/     # Prompt模块
│   │   │   │   ├── user/       # 用户模块
│   │   │   │   └── auth/       # 认证模块
│   │   │   ├── common/
│   │   │   │   ├── config/
│   │   │   │   ├── utils/
│   │   │   │   └── guards/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── prompts/            # Prompt模板
│   │   │   ├── generate_prd.yaml
│   │   │   ├── generate_code.yaml
│   │   │   └── ...
│   │   └── package.json
│   │
│   ├── frontend/               # 前端应用
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── project/
│   │   │   │   ├── workflow/
│   │   │   │   └── common/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   │   └── api.ts
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── App.tsx
│   │   └── package.json
│   │
│   └── shared/                 # 共享代码
│       ├── types/
│       ├── constants/
│       └── utils/
│
├── tools/                      # 工具脚本
│   ├── migrate.ts
│   └── seed.ts
│
├── docs/                       # 文档
│   ├── api/
│   ├── architecture/
│   └── guides/
│
├── config/                     # 配置文件
│   ├── agents.yaml
│   ├── prompts.yaml
│   └── workflows.yaml
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── package.json               # Root package.json
├── turbo.json                 # Turborepo配置
├── tsconfig.json
└── README.md
```

---

## 🚀 MVP实施计划

### 第1周：基础架构搭建

**目标：** 完成项目初始化和核心架构

**任务：**
- [ ] 初始化Monorepo (Turborepo/Nx)
- [ ] 配置TypeScript、ESLint、Prettier
- [ ] 搭建NestJS后端框架
- [ ] 搭建React前端框架
- [ ] 配置Docker开发环境
- [ ] 设置PostgreSQL + MongoDB + Redis

**交付物：**
- 可运行的前后端骨架
- Docker Compose一键启动
- 基础CI/CD流程

---

### 第2周：Agent抽象层实现

**目标：** 实现Agent接口和Claude Code SDK适配器

**任务：**
- [ ] 定义IAgent接口
- [ ] 实现AgentRegistry
- [ ] 实现AgentFactory
- [ ] 实现ClaudeCodeSDKAdapter
- [ ] 编写单元测试
- [ ] 集成Claude Code SDK

**交付物：**
- Agent抽象层代码
- Claude Code SDK适配器
- 测试覆盖率≥80%

---

### 第3周：Prompt管理系统

**目标：** 实现Prompt模板引擎和管理

**任务：**
- [ ] 设计Prompt模板格式
- [ ] 实现PromptManager
- [ ] 实现模板渲染引擎
- [ ] 创建核心Prompt模板（PRD、代码、架构）
- [ ] 实现模板版本管理
- [ ] 实现Few-shot示例系统

**交付物：**
- Prompt管理系统
- 3-5个核心模板
- 模板编辑器原型

---

### 第4周：项目管理与API

**目标：** 实现项目CRUD和基础API

**任务：**
- [ ] 设计数据库Schema
- [ ] 实现项目服务
- [ ] 实现用户认证（JWT）
- [ ] 实现RESTful API
- [ ] 实现文件存储服务
- [ ] API文档（Swagger）

**交付物：**
- 项目管理API
- 用户认证系统
- API文档

---

### 第5周：核心生成功能

**目标：** 实现PRD、代码、架构生成

**任务：**
- [ ] 实现PRD生成Agent任务
- [ ] 实现代码生成Agent任务
- [ ] 实现架构设计Agent任务
- [ ] 实现产出物存储
- [ ] 实现成本计算和记录
- [ ] 实现生成结果展示

**交付物：**
- 三个核心生成功能
- 产出物管理系统
- 成本统计功能

---

### 第6周：前端界面开发

**目标：** 实现MVP前端界面

**任务：**
- [ ] 实现项目列表页
- [ ] 实现项目创建表单
- [ ] 实现生成进度展示
- [ ] 实现产出物查看器
- [ ] 实现代码高亮显示
- [ ] 实现下载功能

**交付物：**
- 完整的前端界面
- 响应式设计
- 流畅的用户体验

---

### 第7周：集成测试与优化

**目标：** 端到端测试和性能优化

**任务：**
- [ ] 编写E2E测试
- [ ] 性能测试和优化
- [ ] 错误处理完善
- [ ] 日志系统完善
- [ ] 监控告警配置
- [ ] 安全加固

**交付物：**
- E2E测试套件
- 性能优化报告
- 监控大盘

---

### 第8周：试用与迭代

**目标：** 内部试用和快速迭代

**任务：**
- [ ] 内部团队试用
- [ ] 收集反馈
- [ ] Bug修复
- [ ] 体验优化
- [ ] 文档完善
- [ ] 准备发布

**交付物：**
- MVP 1.0版本
- 用户手册
- 部署文档

---

## 🔄 Agent替换方案

### 替换Claude Agent示例

**步骤1：实现适配器**

```typescript
class ClaudeAgentAdapter implements IAgent {
  readonly id: string = 'claude-agent';
  readonly name: string = 'Claude Agent';
  readonly type: AgentType = AgentType.CLAUDE_AGENT;
  readonly capabilities: AgentCapability[] = [
    AgentCapability.CODE_GENERATION,
    AgentCapability.PRD_GENERATION,
    // ... 其他能力
  ];

  private client: ClaudeAgentClient;

  async initialize(config: AgentConfig): Promise<void> {
    this.client = new ClaudeAgentClient({
      apiKey: config.apiKey,
      // Claude Agent特定配置
    });
  }

  async execute(task: AgentTask, context: ExecutionContext): Promise<AgentResult> {
    // 转换任务格式为Claude Agent格式
    const agentTask = this.convertTask(task);

    // 调用Claude Agent
    const response = await this.client.executeTask(agentTask);

    // 转换响应为标准格式
    return this.convertResponse(response);
  }

  private convertTask(task: AgentTask): any {
    // 将通用任务格式转换为Claude Agent特定格式
    return {
      // Claude Agent任务格式
    };
  }

  private convertResponse(response: any): AgentResult {
    // 将Claude Agent响应转换为标准格式
    return {
      // 标准结果格式
    };
  }

  // ... 实现其他方法
}
```

**步骤2：注册新Agent**

```typescript
// config/agents.yaml
agents:
  - id: claude-agent-1
    type: claude-agent
    name: Claude Agent
    config:
      apiKey: ${CLAUDE_AGENT_API_KEY}
      model: claude-3.5-sonnet
    enabled: true
    priority: 1  # 优先级
```

**步骤3：配置使用**

```yaml
# 工作流中指定使用新Agent
nodes:
  - id: generate_code
    type: agent
    config:
      agentId: claude-agent-1  # 使用Claude Agent
      taskType: generate_code
```

**步骤4：平滑迁移**

```typescript
// 支持多Agent并行测试
class AgentSelector {
  async selectAgent(
    taskType: TaskType,
    context: ExecutionContext
  ): Promise<IAgent> {
    // 根据策略选择Agent
    const strategy = context.agentSelectionStrategy || 'default';

    switch (strategy) {
      case 'ab-test':
        // A/B测试：随机选择
        return this.randomSelect(taskType);

      case 'cost-optimized':
        // 成本优化：选择最便宜的
        return this.selectByCost(taskType);

      case 'quality-optimized':
        // 质量优化：选择质量最高的
        return this.selectByQuality(taskType);

      default:
        // 默认策略
        return this.selectDefault(taskType);
    }
  }
}
```

---

## 📊 监控与可观测性

### 监控指标

```yaml
系统指标:
  - CPU使用率
  - 内存使用率
  - 磁盘I/O
  - 网络流量

应用指标:
  - API请求数/响应时间
  - 错误率
  - 并发用户数
  - 数据库连接数

业务指标:
  - 项目创建数
  - Agent执行次数
  - 成功率/失败率
  - Token消耗量
  - 总成本

Agent指标:
  - 各Agent使用频率
  - 平均响应时间
  - 成本对比
  - 质量评分
```

### 日志规范

```typescript
// 结构化日志
logger.info('Agent execution started', {
  executionId: 'xxx',
  agentType: 'claude-code-sdk',
  taskType: 'generate_code',
  userId: 'xxx',
  projectId: 'xxx'
});

logger.error('Agent execution failed', {
  executionId: 'xxx',
  error: error.message,
  stack: error.stack,
  retryable: true
});
```

---

## 🔒 安全考虑

### API密钥管理

```typescript
// 使用环境变量或密钥管理服务
const apiKey = process.env.CLAUDE_API_KEY ||
               await secretManager.getSecret('claude-api-key');

// 加密存储用户级API密钥
const encryptedKey = await crypto.encrypt(userApiKey);
await db.users.update({
  id: userId,
  encryptedApiKey: encryptedKey
});
```

### 输入验证

```typescript
// 验证用户输入
const schema = z.object({
  requirement: z.string().min(10).max(5000),
  projectName: z.string().min(1).max(100),
  // ...
});

const validated = schema.parse(userInput);
```

### 输出过滤

```typescript
// 过滤敏感信息
function sanitizeOutput(content: string): string {
  // 移除API密钥、密码等敏感信息
  return content
    .replace(/api[_-]?key[:\s]*['"]?[\w-]+['"]?/gi, '[REDACTED]')
    .replace(/password[:\s]*['"]?[\w-]+['"]?/gi, '[REDACTED]');
}
```

---

## 💰 成本优化策略

### 缓存策略

```typescript
class AgentCache {
  async get(promptHash: string): Promise<CachedResult | null> {
    // 从Redis/MongoDB获取缓存
    const cached = await redis.get(`cache:${promptHash}`);
    if (cached) {
      // 更新命中计数
      await this.incrementHitCount(promptHash);
      return JSON.parse(cached);
    }
    return null;
  }

  async set(
    promptHash: string,
    result: AgentResult,
    ttl: number = 3600
  ): Promise<void> {
    await redis.setex(
      `cache:${promptHash}`,
      ttl,
      JSON.stringify(result)
    );
  }

  // 计算Prompt哈希（语义相似）
  async computeHash(prompt: string): Promise<string> {
    // 使用嵌入模型计算语义哈希
    const embedding = await this.getEmbedding(prompt);
    return this.vectorToHash(embedding);
  }
}
```

### 模型分级

```typescript
class ModelSelector {
  selectModel(task: AgentTask, budget: number): string {
    const complexity = this.estimateComplexity(task);

    if (complexity < 0.3 && budget < 0.01) {
      return 'claude-haiku';  // 便宜快速
    } else if (complexity < 0.7 && budget < 0.05) {
      return 'claude-sonnet';  // 平衡
    } else {
      return 'claude-opus';  // 高质量
    }
  }
}
```

---

## 📈 性能优化

### 并发控制

```typescript
class ConcurrencyLimiter {
  private queue: PQueue;

  constructor(maxConcurrent: number = 10) {
    this.queue = new PQueue({ concurrency: maxConcurrent });
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return this.queue.add(fn);
  }
}
```

### 流式响应

```typescript
// 后端流式API
@Get('/generate/stream')
async generateStream(@Query() dto: GenerateDto, @Res() res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  await this.agentService.executeStream(dto, (chunk) => {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  });

  res.end();
}

// 前端消费
const eventSource = new EventSource('/api/generate/stream?...');
eventSource.onmessage = (event) => {
  const chunk = JSON.parse(event.data);
  // 更新UI
};
```

---

## 🧪 测试策略

### 单元测试

```typescript
describe('ClaudeCodeSDKAdapter', () => {
  let adapter: ClaudeCodeSDKAdapter;

  beforeEach(async () => {
    adapter = new ClaudeCodeSDKAdapter(mockConfig);
    await adapter.initialize(mockConfig);
  });

  it('should execute PRD generation task', async () => {
    const task: AgentTask = {
      id: 'test-task',
      type: TaskType.GENERATE_PRD,
      prompt: 'Build a todo app',
      parameters: {}
    };

    const result = await adapter.execute(task, mockContext);

    expect(result.status).toBe(ExecutionStatus.COMPLETED);
    expect(result.output.content).toContain('Product Requirements Document');
  });
});
```

### 集成测试

```typescript
describe('Workflow Execution', () => {
  it('should execute complete workflow', async () => {
    const workflow = loadWorkflow('prd-to-code');
    const result = await workflowEngine.execute(workflow, {
      requirement: 'Build a blog system'
    });

    expect(result.status).toBe(ExecutionStatus.COMPLETED);
    expect(result.output.artifacts).toHaveLength(greaterThan(0));
  });
});
```

---

## 📚 附录

### 参考资源

- [Claude Code SDK文档](https://docs.anthropic.com/claude/docs/code-sdk)
- [NestJS文档](https://docs.nestjs.com/)
- [Prisma文档](https://www.prisma.io/docs)
- [ReactFlow文档](https://reactflow.dev/)

### 术语表

| 术语 | 定义 |
|------|------|
| Agent | AI代理，执行特定任务的智能实体 |
| Adapter | 适配器，封装具体Agent实现的抽象层 |
| Workflow | 工作流，由多个节点组成的执行流程 |
| Prompt | 提示词，发送给AI的指令文本 |
| Artifact | 产出物，Agent生成的文件或内容 |

### 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2025-11-17 | 初始版本 | InnoLab Team |

---

**最后更新：** 2025-11-17
**下次评审：** 2025-12-01
