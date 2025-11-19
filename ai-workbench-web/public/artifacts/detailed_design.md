# 详细设计文档

## 文档信息

- **项目名称**: E-Commerce Platform
- **模块**: 用户管理模块
- **版本**: v1.0
- **创建日期**: 2025-11-19
- **状态**: 待审核 ⚠️

## 1. 模块概述

本文档详细描述用户管理模块的设计，包括用户注册、登录、个人信息管理等功能。

## 2. 接口设计

### 2.1 用户注册

**接口名称**: 用户注册
**请求路径**: `POST /api/auth/register`
**权限要求**: 无

**请求参数**:
```typescript
interface RegisterRequest {
  email: string;      // 邮箱，必填
  password: string;   // 密码，必填，8-20位
  username: string;   // 用户名，必填，2-20位
  phone?: string;     // 手机号，选填
  verifyCode: string; // 验证码，必填
}
```

**响应参数**:
```typescript
interface RegisterResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      username: string;
      createdAt: string;
    };
    token: string;  // JWT Token
  };
  message: string;
}
```

**业务流程**:
```
1. 接收注册请求
   ↓
2. 验证码校验
   ↓
3. 邮箱重复性检查
   ↓
4. 密码强度验证
   ↓
5. 密码加密 (bcrypt)
   ↓
6. 创建用户记录
   ↓
7. 生成JWT Token
   ↓
8. 返回用户信息和Token
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 400 | 参数验证失败 |
| 409 | 邮箱已存在 |
| 500 | 服务器错误 |

### 2.2 用户登录

**接口名称**: 用户登录
**请求路径**: `POST /api/auth/login`
**权限要求**: 无

**请求参数**:
```typescript
interface LoginRequest {
  email: string;     // 邮箱或手机号
  password: string;  // 密码
  remember?: boolean; // 记住登录，默认false
}
```

**响应参数**:
```typescript
interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: number; // Token过期时间（秒）
  };
  message: string;
}
```

**业务流程**:
```
1. 接收登录请求
   ↓
2. 查找用户（支持邮箱/手机号）
   ↓
3. 验证密码
   ↓
4. 检查账号状态（是否被禁用）
   ↓
5. 生成JWT Token
   ↓
6. 更新最后登录时间
   ↓
7. 返回用户信息和Token
```

### 2.3 获取用户信息

**接口名称**: 获取当前用户信息
**请求路径**: `GET /api/user/profile`
**权限要求**: 需要登录

**请求头**:
```
Authorization: Bearer {token}
```

**响应参数**:
```typescript
interface UserProfileResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    username: string;
    phone?: string;
    avatar?: string;
    createdAt: string;
    lastLoginAt?: string;
  };
}
```

### 2.4 更新用户信息

**接口名称**: 更新用户信息
**请求路径**: `PATCH /api/user/profile`
**权限要求**: 需要登录

**请求参数**:
```typescript
interface UpdateProfileRequest {
  username?: string;
  phone?: string;
  avatar?: string;
}
```

**响应参数**:
```typescript
interface UpdateProfileResponse {
  success: boolean;
  data: User;
  message: string;
}
```

## 3. 数据模型设计

### 3.1 用户模型 (User)

```typescript
interface User {
  id: string;              // UUID
  email: string;           // 邮箱，唯一
  phone?: string;          // 手机号，唯一
  username: string;        // 用户名
  password: string;        // 密码（加密后）
  avatar?: string;         // 头像URL
  isActive: boolean;       // 是否激活
  role: UserRole;          // 用户角色
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
  deletedAt?: Date;        // 删除时间（软删除）
  lastLoginAt?: Date;      // 最后登录时间
}

enum UserRole {
  USER = 'user',           // 普通用户
  MERCHANT = 'merchant',   // 商家
  ADMIN = 'admin'          // 管理员
}
```

### 3.2 数据库表设计

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  last_login_at TIMESTAMP,

  CONSTRAINT chk_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_phone CHECK (phone ~ '^\d{11}$'),
  CONSTRAINT chk_username_length CHECK (length(username) >= 2 AND length(username) <= 20)
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;
```

## 4. 业务逻辑设计

### 4.1 密码加密

**加密方式**: bcrypt
**Cost因子**: 10

```typescript
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 4.2 JWT Token生成

**算法**: HS256
**有效期**: 24小时（remember=true时为7天）

```typescript
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function generateToken(
  payload: TokenPayload,
  remember: boolean = false
): string {
  const expiresIn = remember ? '7d' : '24h';

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn,
    issuer: 'ecommerce-platform',
    audience: 'ecommerce-users',
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}
```

### 4.3 参数验证

使用Joi进行参数验证：

```typescript
import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': '邮箱格式不正确',
      'any.required': '邮箱不能为空',
    }),

  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': '密码至少8位',
      'string.max': '密码最多20位',
      'string.pattern.base': '密码必须包含字母和数字',
      'any.required': '密码不能为空',
    }),

  username: Joi.string()
    .min(2)
    .max(20)
    .required()
    .messages({
      'string.min': '用户名至少2位',
      'string.max': '用户名最多20位',
      'any.required': '用户名不能为空',
    }),

  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .optional()
    .messages({
      'string.pattern.base': '手机号格式不正确',
    }),

  verifyCode: Joi.string()
    .length(6)
    .required()
    .messages({
      'string.length': '验证码必须是6位',
      'any.required': '验证码不能为空',
    }),
});
```

## 5. 异常处理

### 5.1 异常分类

| 异常类型 | HTTP状态码 | 处理方式 |
|----------|-----------|----------|
| 参数验证失败 | 400 | 返回详细错误信息 |
| 未授权访问 | 401 | 返回认证失败提示 |
| 权限不足 | 403 | 返回权限不足提示 |
| 资源不存在 | 404 | 返回资源不存在提示 |
| 资源冲突 | 409 | 返回冲突说明 |
| 服务器错误 | 500 | 记录错误日志，返回通用错误 |

### 5.2 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;        // 错误代码
    message: string;     // 用户友好的错误消息
    details?: any;       // 详细错误信息（开发环境）
    timestamp: string;   // 错误发生时间
    path: string;        // 请求路径
  };
}
```

### 5.3 异常处理中间件

```typescript
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  // Joi验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '参数验证失败',
        details: err.details,
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token无效',
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
  }

  // 其他错误
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误',
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
}
```

## 6. 性能优化

### 6.1 数据库优化

1. **索引优化**
   - email字段：唯一索引
   - phone字段：唯一索引
   - created_at字段：降序索引（列表查询）

2. **查询优化**
   - 使用SELECT指定字段，避免SELECT *
   - 避免N+1查询问题
   - 使用连接池（pool size: 20）

3. **缓存策略**
   - 用户信息缓存（Redis，TTL: 30分钟）
   - 缓存Key格式：`user:{userId}`

### 6.2 接口性能目标

| 接口 | 响应时间 | QPS |
|------|---------|-----|
| 登录 | < 200ms | 1000 |
| 注册 | < 300ms | 500 |
| 获取用户信息 | < 100ms | 2000 |
| 更新用户信息 | < 200ms | 500 |

## 7. 安全设计

### 7.1 安全措施

1. **密码安全**
   - bcrypt加密存储
   - 密码强度验证
   - 登录失败次数限制（5次/15分钟）

2. **Token安全**
   - 短有效期（24小时）
   - HTTPS传输
   - 敏感操作需要重新验证

3. **防止暴力破解**
   - IP限流（100次/分钟）
   - 验证码机制
   - 账号锁定策略

4. **SQL注入防护**
   - 使用参数化查询
   - ORM自动转义

5. **XSS防护**
   - 输入验证
   - 输出转义
   - CSP策略

## 8. 测试用例

### 8.1 单元测试

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('应该成功创建用户', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const user = await userService.createUser(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // 密码应该被加密
    });

    it('邮箱重复时应该抛出错误', async () => {
      await expect(
        userService.createUser(duplicateEmailData)
      ).rejects.toThrow('用户已存在');
    });
  });
});
```

### 8.2 集成测试

```typescript
describe('POST /api/auth/register', () => {
  it('应该成功注册并返回Token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
        verifyCode: '123456',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

---

**设计状态**: ✅ 待审核
**下一步**: 代码实现
