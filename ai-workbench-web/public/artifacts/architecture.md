# 系统架构设计文档

## 文档信息

- **项目名称**: E-Commerce Platform
- **版本**: v1.0
- **创建日期**: 2025-11-19
- **状态**: 待审核 ⚠️

## 1. 架构概览

### 1.1 整体架构
本项目采用**前后端分离**的三层架构设计，实现高内聚、低耦合的系统结构。

```
┌─────────────────────────────────────────────────┐
│              用户层 (User Layer)                 │
│  Web浏览器 / 移动端浏览器 / 小程序               │
└─────────────────────────────────────────────────┘
                      ↓ HTTPS
┌─────────────────────────────────────────────────┐
│           前端层 (Frontend Layer)                │
│  React SPA + TypeScript + Ant Design            │
│  Redux状态管理 + React Router                   │
└─────────────────────────────────────────────────┘
                      ↓ REST API
┌─────────────────────────────────────────────────┐
│            应用层 (Application Layer)            │
│  Node.js + Express + TypeScript                 │
│  业务逻辑 + 控制器 + 中间件                      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            数据层 (Data Layer)                   │
│  PostgreSQL + Redis + MinIO                     │
│  关系数据 + 缓存 + 对象存储                      │
└─────────────────────────────────────────────────┘
```

### 1.2 技术选型

| 层级 | 技术栈 | 理由 |
|------|--------|------|
| 前端框架 | React 18 | 组件化、虚拟DOM、生态完善 |
| 状态管理 | Redux Toolkit | 标准化状态管理、开发工具完善 |
| UI组件库 | Ant Design 5 | 企业级设计、组件丰富 |
| 后端框架 | Express | 轻量、灵活、中间件生态好 |
| 数据库 | PostgreSQL | 开源、支持ACID、性能优秀 |
| 缓存 | Redis | 高性能、支持多种数据结构 |
| 对象存储 | MinIO | 兼容S3、开源、易部署 |

## 2. 前端架构

### 2.1 目录结构

```
ai-workbench-web/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口定义
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── order.ts
│   ├── components/        # 通用组件
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── ProductCard/
│   ├── pages/            # 页面组件
│   │   ├── Home/
│   │   ├── ProductList/
│   │   ├── ProductDetail/
│   │   ├── Cart/
│   │   └── Order/
│   ├── store/            # Redux状态管理
│   │   ├── slices/
│   │   │   ├── userSlice.ts
│   │   │   ├── cartSlice.ts
│   │   │   └── orderSlice.ts
│   │   └── index.ts
│   ├── hooks/            # 自定义Hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useDebounce.ts
│   ├── utils/            # 工具函数
│   │   ├── request.ts
│   │   ├── storage.ts
│   │   └── validator.ts
│   ├── types/            # TypeScript类型定义
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── order.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

### 2.2 路由设计

```typescript
/                      → 首页
/products              → 商品列表
/products/:id          → 商品详情
/cart                  → 购物车
/checkout              → 结算页
/orders                → 订单列表
/orders/:id            → 订单详情
/user/profile          → 个人中心
/user/address          → 地址管理
/login                 → 登录
/register              → 注册
```

### 2.3 状态管理架构

```
Redux Store
├── user          # 用户信息、认证状态
├── cart          # 购物车数据
├── products      # 商品列表、筛选条件
├── orders        # 订单列表、订单详情
└── ui            # UI状态（loading、modal等）
```

### 2.4 API通信

**请求封装**:
```typescript
// src/utils/request.ts
import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器：添加Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401: 未授权，跳转登录
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 3. 后端架构

### 3.1 目录结构

```
backend/
├── src/
│   ├── controllers/      # 控制器层
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── product.controller.ts
│   │   └── order.controller.ts
│   ├── services/         # 业务逻辑层
│   │   ├── user.service.ts
│   │   ├── product.service.ts
│   │   └── order.service.ts
│   ├── models/           # 数据模型
│   │   ├── user.model.ts
│   │   ├── product.model.ts
│   │   └── order.model.ts
│   ├── routes/           # 路由定义
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── product.routes.ts
│   │   └── order.routes.ts
│   ├── middleware/       # 中间件
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/            # 工具函数
│   │   ├── jwt.ts
│   │   ├── crypto.ts
│   │   └── logger.ts
│   ├── database/         # 数据库配置
│   │   ├── connection.ts
│   │   └── migrations/
│   ├── config/           # 配置文件
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   └── app.ts
├── tests/                # 测试文件
├── package.json
└── tsconfig.json
```

### 3.2 分层架构

```
┌─────────────────────────────────────┐
│      Routes (路由层)                 │
│  定义API端点，参数验证                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    Controllers (控制器层)            │
│  处理HTTP请求/响应                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     Services (服务层)                │
│  实现业务逻辑，调用数据层             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     Models (数据层)                  │
│  数据库操作，ORM模型                 │
└─────────────────────────────────────┘
```

### 3.3 API设计规范

**RESTful API设计**:

| 操作 | HTTP方法 | 路径 | 说明 |
|------|----------|------|------|
| 获取用户列表 | GET | /api/users | 支持分页、筛选 |
| 获取用户详情 | GET | /api/users/:id | 返回单个用户 |
| 创建用户 | POST | /api/users | 注册新用户 |
| 更新用户 | PUT | /api/users/:id | 完整更新 |
| 部分更新 | PATCH | /api/users/:id | 部分字段更新 |
| 删除用户 | DELETE | /api/users/:id | 软删除 |

**响应格式标准化**:
```typescript
// 成功响应
{
  "success": true,
  "data": {...},
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": [...]
  }
}
```

### 3.4 认证与授权

**JWT认证流程**:
```
1. 用户登录
   ↓
2. 服务器验证用户名密码
   ↓
3. 生成JWT Token (有效期24小时)
   ↓
4. 返回Token给客户端
   ↓
5. 客户端存储Token (localStorage)
   ↓
6. 后续请求携带Token (Authorization header)
   ↓
7. 服务器验证Token
   ↓
8. 返回受保护资源
```

**权限控制**:
- 普通用户：查看商品、下单、管理个人订单
- 商家：管理自己的商品、查看订单
- 管理员：全部权限

## 4. 数据库设计

### 4.1 数据库选型
- **主数据库**: PostgreSQL 14
  - ACID特性保证数据一致性
  - 支持JSON字段（灵活存储）
  - 强大的查询能力

- **缓存**: Redis 7
  - 热点数据缓存
  - Session存储
  - 消息队列

### 4.2 核心表结构

**用户表 (users)**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

**商品表 (products)**:
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  images JSONB,
  specs JSONB,
  sales_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
```

### 4.3 缓存策略

**多级缓存架构**:
```
┌──────────────┐
│  浏览器缓存   │  (静态资源、商品图片)
└──────────────┘
       ↓
┌──────────────┐
│   CDN缓存     │  (静态资源、图片)
└──────────────┘
       ↓
┌──────────────┐
│  Redis缓存    │  (热点数据、Session)
└──────────────┘
       ↓
┌──────────────┐
│  数据库       │  (持久化数据)
└──────────────┘
```

**缓存内容**:
- 商品信息：TTL 10分钟
- 用户信息：TTL 30分钟
- 购物车：TTL 7天
- 热门商品：TTL 5分钟

## 5. 部署架构

### 5.1 容器化部署

```
┌──────────────────────────────────────┐
│         Nginx (反向代理)              │
│  - 静态资源服务                       │
│  - API请求转发                        │
│  - HTTPS终止                          │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│    Frontend Container (React)        │
│  - Vite构建产物                       │
│  - 静态文件服务                       │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│    Backend Container (Node.js)       │
│  - Express应用                        │
│  - PM2进程管理                        │
│  - 多实例部署                         │
└──────────────────────────────────────┘
              ↓
┌────────────┬────────────┬────────────┐
│ PostgreSQL │   Redis    │   MinIO    │
│  Container │ Container  │ Container  │
└────────────┴────────────┴────────────┘
```

### 5.2 扩展性设计

**水平扩展**:
- 前端：CDN + 多副本
- 后端：负载均衡 + 多实例
- 数据库：主从复制 + 读写分离

**垂直扩展**:
- 增加服务器资源（CPU、内存）
- 数据库连接池优化
- Redis内存扩容

## 6. 安全架构

### 6.1 安全措施

| 层级 | 安全措施 |
|------|----------|
| 网络层 | HTTPS、防火墙、DDoS防护 |
| 应用层 | JWT认证、CSRF防护、XSS防护 |
| 数据层 | SQL注入防护、密码加密、敏感数据加密 |
| 业务层 | 权限控制、操作审计、限流 |

### 6.2 数据加密

- **传输加密**: TLS 1.3
- **密码加密**: bcrypt (cost=10)
- **Token签名**: HMAC-SHA256
- **敏感数据**: AES-256加密

## 7. 监控与日志

### 7.1 监控指标

- **应用监控**: CPU、内存、响应时间
- **数据库监控**: 连接数、查询性能、慢查询
- **业务监控**: 订单量、支付成功率、用户活跃度

### 7.2 日志系统

```
应用日志 → 日志收集器 → 日志存储 → 日志分析
(Winston)   (Fluentd)    (ES)      (Kibana)
```

---

**架构设计状态**: ✅ 待审核
**下一步**: 详细设计
