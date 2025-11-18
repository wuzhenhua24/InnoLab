# AI 工作台 - 前端项目

这是AI研发工作台的前端项目，使用 React + TypeScript + Vite 构建。

## 技术栈

- **React 18** - 用户界面库
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 现代化的前端构建工具
- **React Router** - 路由管理
- **Ant Design** - 企业级UI组件库
- **Day.js** - 轻量级日期处理库

## 项目结构

```
frontend/
├── src/
│   ├── components/      # 可复用组件
│   │   ├── Layout.tsx           # 应用布局组件
│   │   ├── ProjectCard.tsx      # 项目卡片组件
│   │   └── NewProjectModal.tsx  # 新建项目弹窗
│   ├── pages/           # 页面组件
│   │   └── ProjectDashboard.tsx # 项目仪表板页面
│   ├── types/           # TypeScript类型定义
│   │   └── project.ts           # 项目相关类型
│   ├── hooks/           # 自定义React Hooks
│   ├── utils/           # 工具函数
│   ├── styles/          # 全局样式
│   ├── App.tsx          # 应用入口组件
│   └── main.tsx         # 应用主入口
├── public/              # 静态资源
└── index.html           # HTML模板
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 已实现功能

### 项目管理模块

- ✅ 项目仪表板展示
- ✅ 项目列表（卡片展示）
- ✅ 项目搜索功能
- ✅ 新建项目功能
- ✅ 空状态展示
- ✅ 响应式布局

## 后续规划

- [ ] 项目详情页
- [ ] 用户认证登录
- [ ] AI流水线管理
- [ ] 知识库集成
- [ ] 实时协作功能

## 开发规范

- 使用TypeScript进行类型检查
- 使用ESLint进行代码规范检查
- 组件采用函数式组件 + Hooks
- 遵循Ant Design设计规范
