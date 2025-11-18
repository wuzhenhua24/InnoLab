# 文档标准化与知识采集优化方案

## 📋 文档信息

**版本:** V1.0
**创建日期:** 2025-11-18
**状态:** 设计阶段
**关联文档:** knowledge-base-integration-design.md

---

## 🎯 问题描述

当前知识采集层面临的核心挑战:

1. **文档格式多样化** - AI生成、用户编辑、外部导入的文档格式各异
2. **结构化提取困难** - 自由文本难以准确解析出关键信息
3. **元数据缺失** - 缺少足够的上下文信息进行分类和检索
4. **质量难以保证** - 无法有效过滤低质量内容

**影响:**
- 知识采集准确率低
- 检索相关性差
- 知识复用困难

---

## 💡 解决方案设计

### 整体策略

采用 **"源头规范 + 结构化标注 + 智能解析 + 人工校验"** 四层策略:

```
┌─────────────────────────────────────────────────┐
│  Layer 1: 文档模板规范 (Template Standards)      │
│  - 为每种文档类型制定标准模板                     │
│  - Agent生成时直接使用模板                        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Layer 2: 结构化标签 (Structured Annotations)   │
│  - 在文档中嵌入语义标签                          │
│  - 标记关键信息块的类型和用途                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Layer 3: 智能解析器 (Intelligent Parser)       │
│  - 基于标签精确提取                              │
│  - 无标签时使用LLM智能识别                       │
│  - 多策略融合提高准确率                          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Layer 4: 质量校验 (Quality Validation)         │
│  - 自动质量评分                                  │
│  - 低质量内容人工审核                            │
│  - 持续学习优化                                  │
└─────────────────────────────────────────────────┘
```

---

## 📐 Layer 1: 文档模板规范

### 1.1 标准化模板设计

为每种文档类型设计标准化模板,包含:
- **元数据头** - 结构化的文档属性
- **语义标签** - 标记内容块的类型
- **必填字段** - 保证完整性

#### PRD文档模板

```markdown
---
metadata:
  doc_type: prd
  version: "1.0"
  created_by: agent/user_id
  domain: [电商/社交/工具/企业应用/其他]
  scale: [small/medium/large]
  complexity: [low/medium/high]
  tech_stack: []
  tags: []
---

# [项目名称]

<!-- @section:overview -->
## 产品概述

### 背景
[背景描述]

### 目标
[目标描述]

### 价值主张
[价值主张]
<!-- @end:overview -->

<!-- @section:user_stories -->
## 用户故事

### 用户角色
- 角色1: [描述]
- 角色2: [描述]

### 核心用户故事
<!-- @story:id=US-001 priority=high -->
**US-001: [用户故事标题]**
- **作为:** [角色]
- **我想:** [功能需求]
- **以便:** [业务价值]
- **验收标准:**
  - [ ] 标准1
  - [ ] 标准2
<!-- @end:story -->

<!-- @story:id=US-002 priority=medium -->
**US-002: [用户故事标题]**
...
<!-- @end:story -->
<!-- @end:user_stories -->

<!-- @section:functional_requirements -->
## 功能需求

### 核心功能
<!-- @feature:id=F-001 category=core -->
**F-001: [功能名称]**
- 描述: [功能描述]
- 优先级: 高/中/低
- 依赖: [依赖的其他功能]
<!-- @end:feature -->
<!-- @end:functional_requirements -->

<!-- @section:tech_requirements -->
## 技术要求

### 技术栈
<!-- @tech_stack -->
- **前端:** React 18, TypeScript, TailwindCSS
- **后端:** Node.js, Express, PostgreSQL
- **部署:** Docker, AWS
<!-- @end:tech_stack -->

### 性能要求
<!-- @performance -->
- 页面加载时间: < 2s
- API响应时间: < 500ms
- 并发用户: 1000+
<!-- @end:performance -->

### 安全要求
<!-- @security -->
- 用户认证: JWT
- 数据加密: AES-256
- HTTPS: 必须
<!-- @end:security -->
<!-- @end:tech_requirements -->

<!-- @section:non_functional -->
## 非功能需求

### 可用性
[可用性要求]

### 可维护性
[可维护性要求]

### 可扩展性
[可扩展性要求]
<!-- @end:non_functional -->
```

#### 架构设计文档模板

```markdown
---
metadata:
  doc_type: architecture
  version: "1.0"
  project_id: [项目ID]
  architecture_style: [微服务/单体/Serverless/...]
  tech_stack: []
  patterns: [MVC/MVVM/DDD/...]
---

# [项目名称] 架构设计

<!-- @section:overview -->
## 架构概述

### 架构风格
[架构风格说明]

### 设计原则
- 原则1
- 原则2
<!-- @end:overview -->

<!-- @section:system_architecture -->
## 系统架构

### 整体架构图
<!-- @diagram:type=architecture -->
```
[架构图Mermaid代码或图片]
```
<!-- @end:diagram -->

### 核心组件
<!-- @component:id=C-001 type=service -->
**服务名称: [UserService]**
- **职责:** [用户管理]
- **技术栈:** Node.js, Express
- **依赖:** DatabaseService, CacheService
- **API:** /api/users/*
<!-- @end:component -->
<!-- @end:system_architecture -->

<!-- @section:data_model -->
## 数据模型

<!-- @entity:id=User -->
### User实体
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}
```
<!-- @end:entity -->
<!-- @end:data_model -->

<!-- @section:api_design -->
## API设计

<!-- @api:id=API-001 method=POST path=/api/users -->
### 创建用户
- **URL:** `POST /api/users`
- **请求体:**
```json
{
  "username": "string",
  "email": "string"
}
```
- **响应:**
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string"
}
```
<!-- @end:api -->
<!-- @end:api_design -->

<!-- @section:deployment -->
## 部署架构

### 环境配置
<!-- @deployment:env=production -->
- **服务器:** AWS EC2 t3.medium
- **数据库:** RDS PostgreSQL 13
- **缓存:** ElastiCache Redis
<!-- @end:deployment -->
<!-- @end:deployment -->

<!-- @section:security -->
## 安全设计

### 认证授权
[认证授权方案]

### 数据保护
[数据保护措施]
<!-- @end:security -->
```

#### 代码文档模板

```typescript
/**
 * @knowledge_item
 * @category: utility
 * @pattern: Factory Pattern
 * @complexity: medium
 * @reusability: high
 * @domain: authentication
 * @tech_stack: TypeScript, JWT
 */

/**
 * JWT Token工厂类
 *
 * @description 用于创建和验证JWT token的工厂类,实现了单例模式
 * @example
 * ```typescript
 * const factory = TokenFactory.getInstance();
 * const token = factory.createToken({ userId: '123' });
 * const payload = factory.verifyToken(token);
 * ```
 *
 * @best_practice
 * - 使用环境变量存储密钥
 * - 设置合理的过期时间
 * - 验证token时处理所有异常情况
 */
class TokenFactory {
  // 实现代码...
}
```

### 1.2 Agent提示词集成

在Agent的系统提示词中强制使用模板:

```typescript
const PRD_GENERATION_PROMPT = `
你是一个产品经理AI助手,负责生成PRD文档。

**重要:你必须严格按照以下模板生成PRD文档:**

\`\`\`markdown
---
metadata:
  doc_type: prd
  domain: [根据项目选择:电商/社交/工具/企业应用/其他]
  scale: [根据规模选择:small/medium/large]
  tech_stack: [列出推荐的技术栈]
---

# [项目名称]

<!-- @section:overview -->
## 产品概述
[按模板填写]
<!-- @end:overview -->

<!-- @section:user_stories -->
## 用户故事
[按模板填写每个用户故事,使用@story标签]
<!-- @end:user_stories -->

[继续按模板填写其他部分...]
\`\`\`

**标签使用规则:**
1. 元数据头必填
2. 每个section必须用<!-- @section:xxx -->标记
3. 用户故事必须用<!-- @story:id=xxx priority=xxx -->标记
4. 技术栈必须在<!-- @tech_stack -->内列出

现在,请根据用户需求生成PRD文档:
{user_input}
`;
```

---

## 🏷️ Layer 2: 结构化标签系统

### 2.1 标签分类体系

```typescript
/**
 * 标签类型定义
 */
enum AnnotationType {
  // 元数据标签
  METADATA = 'metadata',

  // 章节标签
  SECTION = 'section',

  // 内容块标签
  STORY = 'story',           // 用户故事
  FEATURE = 'feature',       // 功能
  REQUIREMENT = 'requirement', // 需求
  COMPONENT = 'component',   // 组件
  API = 'api',              // API
  ENTITY = 'entity',        // 实体
  DIAGRAM = 'diagram',      // 图表
  CODE = 'code',            // 代码块

  // 属性标签
  TECH_STACK = 'tech_stack',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  DEPLOYMENT = 'deployment',

  // 质量标签
  BEST_PRACTICE = 'best_practice',
  WARNING = 'warning',
  TODO = 'todo'
}

/**
 * 标签属性定义
 */
interface AnnotationAttributes {
  id?: string;           // 唯一标识
  type?: string;         // 类型
  priority?: 'high' | 'medium' | 'low';
  category?: string;     // 分类
  tags?: string[];       // 自定义标签
  [key: string]: any;    // 其他属性
}
```

### 2.2 标签语法规范

**基本语法:**
```markdown
<!-- @{type}:{attr1}={value1} {attr2}={value2} -->
[内容]
<!-- @end:{type} -->
```

**示例:**
```markdown
<!-- @story:id=US-001 priority=high category=core -->
**用户故事:** 作为用户,我想要登录系统
<!-- @end:story -->

<!-- @api:id=API-001 method=POST path=/auth/login -->
登录API文档
<!-- @end:api -->

<!-- @best_practice:pattern=Singleton context=authentication -->
在认证服务中使用单例模式可以确保全局只有一个认证实例
<!-- @end:best_practice -->
```

### 2.3 标签验证器

```typescript
/**
 * 标签验证器
 */
class AnnotationValidator {
  /**
   * 验证文档中的标签
   */
  validate(content: string, docType: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // 1. 检查必需标签
    const requiredTags = this.getRequiredTags(docType);
    requiredTags.forEach(tag => {
      if (!this.hasAnnotation(content, tag)) {
        errors.push({
          type: 'missing_required_tag',
          message: `缺少必需标签: ${tag}`,
          severity: 'error'
        });
      }
    });

    // 2. 检查标签完整性
    const openTags = this.extractOpenTags(content);
    const closeTags = this.extractCloseTags(content);

    openTags.forEach(tag => {
      if (!closeTags.includes(tag.type)) {
        errors.push({
          type: 'unclosed_tag',
          message: `标签未关闭: @${tag.type} at line ${tag.line}`,
          severity: 'error'
        });
      }
    });

    // 3. 检查标签嵌套
    const nestingErrors = this.validateNesting(content);
    errors.push(...nestingErrors);

    // 4. 检查属性有效性
    openTags.forEach(tag => {
      const attrErrors = this.validateAttributes(tag);
      errors.push(...attrErrors);
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private getRequiredTags(docType: string): string[] {
    const requirements: Record<string, string[]> = {
      'prd': ['metadata', 'section:overview', 'section:user_stories'],
      'architecture': ['metadata', 'section:system_architecture'],
      'api': ['metadata', 'api']
    };
    return requirements[docType] || [];
  }

  private hasAnnotation(content: string, annotationType: string): boolean {
    const pattern = new RegExp(`<!--\\s*@${annotationType}[:\\s]`, 'i');
    return pattern.test(content);
  }

  private extractOpenTags(content: string): AnnotationTag[] {
    const pattern = /<!--\s*@(\w+):?([^>]*?)-->/g;
    const tags: AnnotationTag[] = [];
    let match;

    const lines = content.split('\n');
    let lineNum = 0;

    for (const line of lines) {
      lineNum++;
      const regex = /<!--\s*@(\w+):?([^>]*?)-->/g;
      while ((match = regex.exec(line)) !== null) {
        tags.push({
          type: match[1],
          attributes: this.parseAttributes(match[2]),
          line: lineNum,
          raw: match[0]
        });
      }
    }

    return tags;
  }

  private extractCloseTags(content: string): string[] {
    const pattern = /<!--\s*@end:(\w+)\s*-->/g;
    const tags: string[] = [];
    let match;

    while ((match = pattern.exec(content)) !== null) {
      tags.push(match[1]);
    }

    return tags;
  }

  private parseAttributes(attrString: string): AnnotationAttributes {
    const attrs: AnnotationAttributes = {};
    const pattern = /(\w+)=([^\s]+)/g;
    let match;

    while ((match = pattern.exec(attrString)) !== null) {
      attrs[match[1]] = match[2];
    }

    return attrs;
  }

  private validateNesting(content: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const stack: AnnotationTag[] = [];
    const openTags = this.extractOpenTags(content);
    const closePattern = /<!--\s*@end:(\w+)\s*-->/g;

    // 简化的嵌套检查
    // 实际应该构建完整的解析树

    return errors;
  }

  private validateAttributes(tag: AnnotationTag): ValidationError[] {
    const errors: ValidationError[] = [];

    // 检查必需属性
    const requiredAttrs = this.getRequiredAttributes(tag.type);
    requiredAttrs.forEach(attr => {
      if (!tag.attributes[attr]) {
        errors.push({
          type: 'missing_attribute',
          message: `标签@${tag.type}缺少必需属性: ${attr}`,
          severity: 'error'
        });
      }
    });

    return errors;
  }

  private getRequiredAttributes(tagType: string): string[] {
    const requirements: Record<string, string[]> = {
      'story': ['id', 'priority'],
      'feature': ['id'],
      'api': ['id', 'method', 'path'],
      'component': ['id', 'type']
    };
    return requirements[tagType] || [];
  }
}

interface AnnotationTag {
  type: string;
  attributes: AnnotationAttributes;
  line: number;
  raw: string;
}

interface ValidationError {
  type: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}
```

---

## 🧠 Layer 3: 智能解析器

### 3.1 混合解析策略

结合规则解析和LLM智能解析:

```typescript
/**
 * 混合解析器
 */
class HybridDocumentParser {
  constructor(
    private ruleBasedParser: RuleBasedParser,
    private llmParser: LLMBasedParser
  ) {}

  /**
   * 解析文档
   */
  async parse(content: string, docType: string): Promise<ParsedDocument> {
    // 1. 尝试基于规则的解析(快速、准确)
    const ruleResult = await this.ruleBasedParser.parse(content, docType);

    // 2. 检查解析质量
    const quality = this.assessParseQuality(ruleResult);

    if (quality.score >= 0.8) {
      // 规则解析质量高,直接使用
      return ruleResult;
    }

    // 3. 质量不足,使用LLM增强
    const llmEnhanced = await this.llmParser.enhance(content, ruleResult);

    // 4. 融合两种结果
    return this.mergeResults(ruleResult, llmEnhanced);
  }

  private assessParseQuality(result: ParsedDocument): QualityAssessment {
    let score = 1.0;
    const issues: string[] = [];

    // 检查必填字段
    if (!result.metadata?.domain) {
      score -= 0.2;
      issues.push('缺少domain');
    }

    // 检查内容完整性
    if (result.sections.length === 0) {
      score -= 0.3;
      issues.push('未解析到任何section');
    }

    // 检查结构化数据
    if (result.structuredData.length === 0) {
      score -= 0.3;
      issues.push('未解析到结构化数据');
    }

    return { score, issues };
  }

  private mergeResults(
    ruleResult: ParsedDocument,
    llmResult: ParsedDocument
  ): ParsedDocument {
    return {
      ...ruleResult,
      metadata: {
        ...ruleResult.metadata,
        ...llmResult.metadata
      },
      sections: this.mergeSections(ruleResult.sections, llmResult.sections),
      structuredData: this.mergeStructuredData(
        ruleResult.structuredData,
        llmResult.structuredData
      )
    };
  }

  private mergeSections(
    ruleSections: Section[],
    llmSections: Section[]
  ): Section[] {
    // 以规则解析为主,LLM补充
    const merged = [...ruleSections];

    llmSections.forEach(llmSec => {
      const existing = merged.find(s => s.type === llmSec.type);
      if (!existing) {
        merged.push(llmSec);
      }
    });

    return merged;
  }

  private mergeStructuredData(
    ruleData: StructuredData[],
    llmData: StructuredData[]
  ): StructuredData[] {
    // 合并结构化数据,去重
    const merged = new Map<string, StructuredData>();

    [...ruleData, ...llmData].forEach(data => {
      const key = `${data.type}-${data.id}`;
      if (!merged.has(key)) {
        merged.set(key, data);
      }
    });

    return Array.from(merged.values());
  }
}

interface QualityAssessment {
  score: number;
  issues: string[];
}
```

### 3.2 基于规则的解析器

```typescript
/**
 * 基于规则的解析器(用于有标签的文档)
 */
class RuleBasedParser {
  async parse(content: string, docType: string): Promise<ParsedDocument> {
    const result: ParsedDocument = {
      metadata: {},
      sections: [],
      structuredData: [],
      rawContent: content
    };

    // 1. 解析元数据
    result.metadata = this.parseMetadata(content);

    // 2. 解析章节
    result.sections = this.parseSections(content);

    // 3. 解析结构化数据
    result.structuredData = this.parseStructuredData(content, docType);

    return result;
  }

  private parseMetadata(content: string): DocumentMetadata {
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!yamlMatch) {
      return {};
    }

    try {
      // 简化的YAML解析
      const yaml = yamlMatch[1];
      const metadata: any = {};

      // 解析metadata块
      const metadataMatch = yaml.match(/metadata:\s*\n([\s\S]*?)(?=\n\w+:|$)/);
      if (metadataMatch) {
        const lines = metadataMatch[1].split('\n');
        lines.forEach(line => {
          const match = line.match(/^\s+(\w+):\s*(.+)$/);
          if (match) {
            const [, key, value] = match;
            // 处理数组
            if (value.startsWith('[')) {
              metadata[key] = JSON.parse(value.replace(/'/g, '"'));
            } else {
              metadata[key] = value.replace(/['"]/g, '');
            }
          }
        });
      }

      return metadata;
    } catch (error) {
      console.error('Failed to parse metadata:', error);
      return {};
    }
  }

  private parseSections(content: string): Section[] {
    const sections: Section[] = [];
    const pattern = /<!--\s*@section:(\w+)\s*-->([\s\S]*?)<!--\s*@end:\1\s*-->/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      sections.push({
        type: match[1],
        content: match[2].trim(),
        startPos: match.index,
        endPos: match.index + match[0].length
      });
    }

    return sections;
  }

  private parseStructuredData(content: string, docType: string): StructuredData[] {
    const data: StructuredData[] = [];

    // 根据文档类型解析不同的结构化数据
    switch (docType) {
      case 'prd':
        data.push(...this.parseUserStories(content));
        data.push(...this.parseFeatures(content));
        data.push(...this.parseTechStack(content));
        break;
      case 'architecture':
        data.push(...this.parseComponents(content));
        data.push(...this.parseAPIs(content));
        data.push(...this.parseEntities(content));
        break;
    }

    return data;
  }

  private parseUserStories(content: string): StructuredData[] {
    const stories: StructuredData[] = [];
    const pattern = /<!--\s*@story:([^>]+)-->([\s\S]*?)<!--\s*@end:story\s*-->/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const attrs = this.parseAnnotationAttributes(match[1]);
      const storyContent = match[2].trim();

      // 解析用户故事内容
      const asMatch = storyContent.match(/\*\*作为:\*\*\s*(.+)/);
      const wantMatch = storyContent.match(/\*\*我想:\*\*\s*(.+)/);
      const soMatch = storyContent.match(/\*\*以便:\*\*\s*(.+)/);

      stories.push({
        type: 'user_story',
        id: attrs.id || '',
        data: {
          priority: attrs.priority,
          as: asMatch ? asMatch[1].trim() : '',
          want: wantMatch ? wantMatch[1].trim() : '',
          so: soMatch ? soMatch[1].trim() : '',
          acceptanceCriteria: this.extractAcceptanceCriteria(storyContent)
        }
      });
    }

    return stories;
  }

  private parseFeatures(content: string): StructuredData[] {
    const features: StructuredData[] = [];
    const pattern = /<!--\s*@feature:([^>]+)-->([\s\S]*?)<!--\s*@end:feature\s*-->/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const attrs = this.parseAnnotationAttributes(match[1]);
      const featureContent = match[2].trim();

      features.push({
        type: 'feature',
        id: attrs.id || '',
        data: {
          category: attrs.category,
          content: featureContent
        }
      });
    }

    return features;
  }

  private parseTechStack(content: string): StructuredData[] {
    const techStacks: StructuredData[] = [];
    const pattern = /<!--\s*@tech_stack\s*-->([\s\S]*?)<!--\s*@end:tech_stack\s*-->/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const stackContent = match[1].trim();
      const items = stackContent.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
          const cleaned = line.replace(/^-\s*\*\*(.+?):\*\*\s*(.+)$/, '$1: $2');
          return cleaned;
        });

      techStacks.push({
        type: 'tech_stack',
        id: 'tech-stack-1',
        data: {
          items
        }
      });
    }

    return techStacks;
  }

  private parseComponents(content: string): StructuredData[] {
    const components: StructuredData[] = [];
    const pattern = /<!--\s*@component:([^>]+)-->([\s\S]*?)<!--\s*@end:component\s*-->/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const attrs = this.parseAnnotationAttributes(match[1]);
      const componentContent = match[2].trim();

      components.push({
        type: 'component',
        id: attrs.id || '',
        data: {
          componentType: attrs.type,
          content: componentContent
        }
      });
    }

    return components;
  }

  private parseAPIs(content: string): StructuredData[] {
    const apis: StructuredData[] = [];
    const pattern = /<!--\s*@api:([^>]+)-->([\s\S]*?)<!--\s*@end:api\s*-->/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const attrs = this.parseAnnotationAttributes(match[1]);
      const apiContent = match[2].trim();

      apis.push({
        type: 'api',
        id: attrs.id || '',
        data: {
          method: attrs.method,
          path: attrs.path,
          content: apiContent
        }
      });
    }

    return apis;
  }

  private parseEntities(content: string): StructuredData[] {
    const entities: StructuredData[] = [];
    const pattern = /<!--\s*@entity:([^>]+)-->([\s\S]*?)<!--\s*@end:entity\s*-->/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const attrs = this.parseAnnotationAttributes(match[1]);
      const entityContent = match[2].trim();

      entities.push({
        type: 'entity',
        id: attrs.id || '',
        data: {
          content: entityContent
        }
      });
    }

    return entities;
  }

  private parseAnnotationAttributes(attrString: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const pattern = /(\w+)=([^\s]+)/g;
    let match;

    while ((match = pattern.exec(attrString)) !== null) {
      attrs[match[1]] = match[2];
    }

    return attrs;
  }

  private extractAcceptanceCriteria(content: string): string[] {
    const criteria: string[] = [];
    const lines = content.split('\n');
    let inCriteria = false;

    for (const line of lines) {
      if (line.includes('验收标准') || line.includes('Acceptance Criteria')) {
        inCriteria = true;
        continue;
      }

      if (inCriteria && line.trim().startsWith('- [')) {
        const criterion = line.replace(/^-\s*\[.\]\s*/, '').trim();
        criteria.push(criterion);
      }
    }

    return criteria;
  }
}

interface ParsedDocument {
  metadata: DocumentMetadata;
  sections: Section[];
  structuredData: StructuredData[];
  rawContent: string;
}

interface DocumentMetadata {
  doc_type?: string;
  version?: string;
  domain?: string;
  scale?: string;
  tech_stack?: string[];
  [key: string]: any;
}

interface Section {
  type: string;
  content: string;
  startPos: number;
  endPos: number;
}

interface StructuredData {
  type: string;
  id: string;
  data: any;
}
```

### 3.3 基于LLM的智能解析器

```typescript
/**
 * 基于LLM的智能解析器(用于无标签或低质量标签的文档)
 */
class LLMBasedParser {
  constructor(private llmClient: LLMClient) {}

  async parse(content: string, docType: string): Promise<ParsedDocument> {
    const prompt = this.buildParsePrompt(content, docType);
    const response = await this.llmClient.complete(prompt);

    // 解析LLM返回的结构化数据
    return this.parseResponse(response);
  }

  async enhance(
    content: string,
    ruleResult: ParsedDocument
  ): Promise<ParsedDocument> {
    const prompt = this.buildEnhancePrompt(content, ruleResult);
    const response = await this.llmClient.complete(prompt);

    return this.parseResponse(response);
  }

  private buildParsePrompt(content: string, docType: string): string {
    return `
你是一个文档解析专家。请分析以下${docType}文档,提取关键信息。

文档内容:
\`\`\`markdown
${content}
\`\`\`

请按以下JSON格式返回解析结果:
\`\`\`json
{
  "metadata": {
    "doc_type": "${docType}",
    "domain": "识别的业务领域",
    "scale": "small/medium/large",
    "tech_stack": ["识别到的技术栈"],
    "tags": ["相关标签"]
  },
  "sections": [
    {
      "type": "overview/user_stories/requirements等",
      "title": "章节标题",
      "summary": "章节摘要"
    }
  ],
  "structuredData": [
    // 根据文档类型提取的结构化数据
    // PRD: user_story, feature
    // Architecture: component, api, entity
  ]
}
\`\`\`
`;
  }

  private buildEnhancePrompt(
    content: string,
    ruleResult: ParsedDocument
  ): string {
    return `
文档内容:
\`\`\`markdown
${content}
\`\`\`

已有解析结果:
\`\`\`json
${JSON.stringify(ruleResult, null, 2)}
\`\`\`

请补充和完善解析结果,特别是:
1. 补充缺失的metadata字段
2. 识别未标注的结构化数据
3. 提取关键标签和分类信息

返回完整的JSON格式结果。
`;
  }

  private async parseResponse(response: string): Promise<ParsedDocument> {
    try {
      // 提取JSON
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from LLM response');
      }

      const parsed = JSON.parse(jsonMatch[1]);

      return {
        metadata: parsed.metadata || {},
        sections: parsed.sections || [],
        structuredData: parsed.structuredData || [],
        rawContent: ''
      };
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      return {
        metadata: {},
        sections: [],
        structuredData: [],
        rawContent: ''
      };
    }
  }
}
```

---

## ✅ Layer 4: 质量校验

### 4.1 自动质量评分

```typescript
/**
 * 文档质量评估器
 */
class DocumentQualityAssessor {
  assess(parsed: ParsedDocument, docType: string): QualityScore {
    const scores: Partial<QualityScore> = {};

    // 1. 完整性评分
    scores.completeness = this.assessCompleteness(parsed, docType);

    // 2. 结构性评分
    scores.clarity = this.assessClarity(parsed);

    // 3. 准确性评分(基于元数据完整度)
    scores.accuracy = this.assessAccuracy(parsed);

    // 4. 实用性评分
    scores.usefulness = this.assessUsefulness(parsed, docType);

    // 5. 时效性
    scores.timeliness = 100; // 新文档默认100

    // 计算总分
    scores.overall = (
      scores.completeness! * 0.3 +
      scores.clarity! * 0.2 +
      scores.accuracy! * 0.2 +
      scores.usefulness! * 0.2 +
      scores.timeliness! * 0.1
    );

    return scores as QualityScore;
  }

  private assessCompleteness(parsed: ParsedDocument, docType: string): number {
    const requirements = this.getCompletenessRequirements(docType);
    let score = 0;
    let total = 0;

    requirements.forEach(req => {
      total += req.weight;
      if (this.checkRequirement(parsed, req)) {
        score += req.weight;
      }
    });

    return total > 0 ? (score / total) * 100 : 0;
  }

  private getCompletenessRequirements(docType: string): Requirement[] {
    const requirements: Record<string, Requirement[]> = {
      'prd': [
        { field: 'metadata.domain', weight: 10, required: true },
        { field: 'metadata.tech_stack', weight: 10, required: true },
        { field: 'sections.overview', weight: 20, required: true },
        { field: 'sections.user_stories', weight: 25, required: true },
        { field: 'sections.tech_requirements', weight: 20, required: true },
        { field: 'structuredData.user_story', weight: 15, required: false }
      ],
      'architecture': [
        { field: 'metadata.architecture_style', weight: 15, required: true },
        { field: 'metadata.tech_stack', weight: 10, required: true },
        { field: 'sections.system_architecture', weight: 25, required: true },
        { field: 'sections.data_model', weight: 20, required: true },
        { field: 'structuredData.component', weight: 15, required: false },
        { field: 'structuredData.api', weight: 15, required: false }
      ]
    };

    return requirements[docType] || [];
  }

  private checkRequirement(parsed: ParsedDocument, req: Requirement): boolean {
    const parts = req.field.split('.');

    if (parts[0] === 'metadata') {
      return !!parsed.metadata[parts[1]];
    }

    if (parts[0] === 'sections') {
      return parsed.sections.some(s => s.type === parts[1]);
    }

    if (parts[0] === 'structuredData') {
      return parsed.structuredData.some(d => d.type === parts[1]);
    }

    return false;
  }

  private assessClarity(parsed: ParsedDocument): number {
    let score = 100;

    // 扣分项:
    // 1. 缺少章节标题
    if (parsed.sections.length === 0) {
      score -= 30;
    }

    // 2. 内容过短
    const totalLength = parsed.sections.reduce((sum, s) => sum + s.content.length, 0);
    if (totalLength < 500) {
      score -= 20;
    }

    // 3. 缺少结构化数据
    if (parsed.structuredData.length === 0) {
      score -= 25;
    }

    return Math.max(0, score);
  }

  private assessAccuracy(parsed: ParsedDocument): number {
    // 基于元数据完整度
    const metadataFields = Object.keys(parsed.metadata);
    const expectedFields = ['doc_type', 'domain', 'tech_stack', 'tags'];

    const completeness = expectedFields.filter(f => metadataFields.includes(f)).length / expectedFields.length;

    return completeness * 100;
  }

  private assessUsefulness(parsed: ParsedDocument, docType: string): number {
    // 基于结构化数据的丰富程度
    const structuredDataCount = parsed.structuredData.length;

    let score = 50; // 基础分

    if (structuredDataCount >= 5) {
      score += 30;
    } else if (structuredDataCount >= 3) {
      score += 20;
    } else if (structuredDataCount >= 1) {
      score += 10;
    }

    // 技术栈信息加分
    if (parsed.metadata.tech_stack && parsed.metadata.tech_stack.length > 0) {
      score += 20;
    }

    return Math.min(100, score);
  }
}

interface Requirement {
  field: string;
  weight: number;
  required: boolean;
}

interface QualityScore {
  overall: number;
  completeness: number;
  accuracy: number;
  clarity: number;
  usefulness: number;
  timeliness: number;
}
```

### 4.2 人工审核流程

```typescript
/**
 * 审核工作流
 */
class ReviewWorkflow {
  async submitForReview(
    item: KnowledgeItem,
    quality: QualityScore
  ): Promise<void> {
    // 1. 自动通过高质量内容
    if (quality.overall >= 80) {
      await this.autoApprove(item);
      return;
    }

    // 2. 自动拒绝低质量内容
    if (quality.overall < 50) {
      await this.autoReject(item, quality);
      return;
    }

    // 3. 中等质量内容进入人工审核
    await this.createReviewTask(item, quality);
  }

  private async autoApprove(item: KnowledgeItem): Promise<void> {
    await this.db.knowledgeItems.update({
      where: { id: item.id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: 'system'
      }
    });

    // 触发索引
    await this.knowledgeService.indexKnowledge(item);
  }

  private async autoReject(item: KnowledgeItem, quality: QualityScore): Promise<void> {
    await this.db.knowledgeItems.update({
      where: { id: item.id },
      data: {
        status: 'rejected',
        rejectionReason: `质量评分过低: ${quality.overall}`,
        rejectedAt: new Date()
      }
    });
  }

  private async createReviewTask(
    item: KnowledgeItem,
    quality: QualityScore
  ): Promise<void> {
    await this.db.reviewTasks.create({
      data: {
        knowledgeItemId: item.id,
        type: 'knowledge_review',
        priority: this.calculatePriority(quality),
        qualityScore: quality,
        status: 'pending',
        createdAt: new Date()
      }
    });

    // 通知审核人员
    await this.notifyReviewers(item, quality);
  }

  private calculatePriority(quality: QualityScore): 'high' | 'medium' | 'low' {
    if (quality.overall >= 70) return 'low';
    if (quality.overall >= 60) return 'medium';
    return 'high';
  }

  private async notifyReviewers(
    item: KnowledgeItem,
    quality: QualityScore
  ): Promise<void> {
    // TODO: 发送通知
  }
}
```

---

## 🚀 实施策略

### 渐进式实施路径

**阶段1: 模板标准化(1-2周)**
- 为PRD、架构设计、API文档设计标准模板
- 更新Agent提示词,强制使用模板
- 验证模板的可用性

**阶段2: 标签系统开发(2-3周)**
- 实现标签验证器
- 实现基于规则的解析器
- 开发标签辅助工具(VSCode插件等)

**阶段3: 智能解析器(3-4周)**
- 实现混合解析策略
- 开发LLM增强解析
- 测试和优化解析准确率

**阶段4: 质量保障(2周)**
- 实现质量评估器
- 建立审核工作流
- 配置监控告警

**阶段5: 迁移和优化(持续)**
- 将现有文档逐步迁移到新模板
- 根据反馈优化模板和解析器
- 持续提升解析准确率

---

## 📊 效果预期

### 量化指标

| 指标 | 当前 | 目标 | 改善 |
|------|------|------|------|
| 文档结构化率 | ~30% | 90%+ | +200% |
| 元数据完整性 | ~40% | 85%+ | +112% |
| 采集准确率 | ~60% | 90%+ | +50% |
| 检索相关性 | ~65% | 85%+ | +30% |
| 人工审核率 | ~80% | 30% | -62% |

### 业务价值

1. **提升知识质量** - 标准化保证知识完整性和准确性
2. **降低采集成本** - 自动化解析减少人工介入
3. **增强检索效果** - 结构化数据提升检索准确度
4. **提高复用率** - 标准化的知识更容易被发现和复用
5. **加速迭代** - 清晰的结构支持快速定位和更新

---

## 🛠️ 开发工具支持

### VSCode插件

开发一个VSCode插件辅助文档编写:

**功能:**
- 提供文档模板snippets
- 实时验证标签语法
- 高亮显示标签
- 自动补全标签属性
- 预览解析结果

---

## 📝 最佳实践建议

### 对于Agent开发者

1. **强制使用模板** - 在系统提示词中明确要求
2. **内置模板库** - 提供常用模板的快捷访问
3. **验证输出** - Agent输出后自动验证标签完整性
4. **反馈循环** - 解析失败时提示Agent修正

### 对于用户

1. **编辑器支持** - 使用支持模板和标签的编辑器
2. **保持结构** - 不要删除标签和元数据头
3. **及时保存** - 避免丢失标签信息
4. **利用模板** - 创建自定义模板提高效率

---

## 🔄 与现有方案的集成

本方案是对 `knowledge-base-integration-design.md` 的补充和增强:

**集成点:**

1. **采集器增强** - 在现有采集器基础上增加标签解析能力
2. **质量评估扩展** - 补充质量评估的具体实现
3. **数据模型扩展** - 增加标签和结构化数据字段
4. **同步优化** - 只同步高质量的结构化知识

**修改建议:**

在 `PRDCollector` 中集成新的解析器:

```typescript
class PRDCollector implements IKnowledgeCollector {
  constructor(
    private db: Database,
    private qualityAnalyzer: QualityAnalyzer,
    private parser: HybridDocumentParser  // 新增
  ) {}

  async collect(source: KnowledgeSource): Promise<KnowledgeItem[]> {
    const artifacts = await this.db.artifacts.findMany({...});
    const items: KnowledgeItem[] = [];

    for (const artifact of artifacts) {
      // 使用新的解析器
      const parsed = await this.parser.parse(artifact.content, 'prd');

      // 质量评估
      const assessor = new DocumentQualityAssessor();
      const quality = assessor.assess(parsed, 'prd');

      // 只采集高质量内容
      if (quality.overall >= 50) {
        items.push({
          id: generateId(),
          type: KnowledgeType.PRD,
          title: parsed.metadata.title || artifact.name,
          content: artifact.content,
          source: {...},
          metadata: parsed.metadata,
          quality,
          tags: parsed.metadata.tags || [],
          createdAt: artifact.createdAt
        });
      }
    }

    return items;
  }
}
```

---

## 📚 参考资料

- [Markdown规范](https://commonmark.org/)
- [YAML语法](https://yaml.org/)
- [HTML注释规范](https://html.spec.whatwg.org/multipage/syntax.html#comments)
- [知识图谱构建最佳实践](https://www.w3.org/TR/swbp-skos-core-guide/)

---

**文档状态:** 待评审
**下一步行动:** 团队评审 → 原型开发 → 小范围测试
