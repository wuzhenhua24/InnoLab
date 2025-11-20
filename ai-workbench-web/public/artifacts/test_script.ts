/**
 * 用户服务单元测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UserService } from '../services/user.service';
import { db } from '../database/connection';
import { hashPassword } from '../utils/crypto';

// Mock数据库连接
vi.mock('../database/connection', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock工具函数
vi.mock('../utils/crypto', () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
}));

vi.mock('../utils/jwt', () => ({
  generateToken: vi.fn(() => 'mock-token'),
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('应该成功创建用户', async () => {
      // 准备测试数据
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        phone: '13800138000',
      };

      const hashedPassword = 'hashed-password';
      const createdUser = {
        id: 'user-123',
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock函数行为
      (db.user.findUnique as any).mockResolvedValue(null);
      (hashPassword as any).mockResolvedValue(hashedPassword);
      (db.user.create as any).mockResolvedValue(createdUser);

      // 执行测试
      const result = await userService.createUser(userData);

      // 验证结果
      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.username).toBe(userData.username);
      expect((result as any).password).toBeUndefined(); // 密码应该被移除
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(hashPassword).toHaveBeenCalledWith(userData.password);
      expect(db.user.create).toHaveBeenCalled();
    });

    it('当用户已存在时应该抛出错误', async () => {
      // 准备测试数据
      const userData = {
        email: 'existing@example.com',
        username: 'existinguser',
        password: 'password123',
        phone: '13800138000',
      };

      // Mock用户已存在
      (db.user.findUnique as any).mockResolvedValue({
        id: 'existing-user-id',
        email: userData.email,
      });

      // 执行测试并验证抛出错误
      await expect(userService.createUser(userData)).rejects.toThrow('用户已存在');
    });
  });

  describe('login', () => {
    it('应该成功登录并返回用户信息和token', async () => {
      // 准备测试数据
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashed-password';
      const user = {
        id: 'user-123',
        email,
        username: 'testuser',
        password: hashedPassword,
        phone: '13800138000',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
      };

      // Mock函数行为
      (db.user.findUnique as any).mockResolvedValue(user);
      const { comparePassword } = await import('../utils/crypto');
      (comparePassword as any).mockResolvedValue(true);
      (db.user.update as any).mockResolvedValue(user);

      // 执行测试
      const result = await userService.login(email, password);

      // 验证结果
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe(email);
      expect((result.user as any).password).toBeUndefined();
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: { lastLoginAt: expect.any(Date) },
      });
    });

    it('当用户不存在时应该抛出错误', async () => {
      // Mock用户不存在
      (db.user.findUnique as any).mockResolvedValue(null);

      // 执行测试并验证抛出错误
      await expect(
        userService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('用户不存在');
    });

    it('当密码错误时应该抛出错误', async () => {
      // 准备测试数据
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed-password',
      };

      // Mock函数行为
      (db.user.findUnique as any).mockResolvedValue(user);
      const { comparePassword } = await import('../utils/crypto');
      (comparePassword as any).mockResolvedValue(false);

      // 执行测试并验证抛出错误
      await expect(
        userService.login('test@example.com', 'wrong-password')
      ).rejects.toThrow('密码错误');
    });
  });

  describe('getUserById', () => {
    it('应该返回用户信息', async () => {
      // 准备测试数据
      const userId = 'user-123';
      const user = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        phone: '13800138000',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
      };

      // Mock函数行为
      (db.user.findUnique as any).mockResolvedValue(user);

      // 执行测试
      const result = await userService.getUserById(userId);

      // 验证结果
      expect(result).toEqual(user);
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: expect.any(Object),
      });
    });

    it('当用户不存在时应该返回null', async () => {
      // Mock用户不存在
      (db.user.findUnique as any).mockResolvedValue(null);

      // 执行测试
      const result = await userService.getUserById('nonexistent-id');

      // 验证结果
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('应该成功更新用户信息', async () => {
      // 准备测试数据
      const userId = 'user-123';
      const existingUser = {
        id: userId,
        email: 'old@example.com',
        username: 'oldname',
      };
      const updateData = {
        username: 'newname',
        phone: '13900139000',
      };
      const updatedUser = {
        ...existingUser,
        ...updateData,
        updatedAt: new Date(),
      };

      // Mock函数行为
      (db.user.findUnique as any).mockResolvedValue(existingUser);
      (db.user.update as any).mockResolvedValue(updatedUser);

      // 执行测试
      const result = await userService.updateUser(userId, updateData);

      // 验证结果
      expect(result.username).toBe(updateData.username);
      expect(result.phone).toBe(updateData.phone);
      expect(db.user.update).toHaveBeenCalled();
    });

    it('当用户不存在时应该抛出错误', async () => {
      // Mock用户不存在
      (db.user.findUnique as any).mockResolvedValue(null);

      // 执行测试并验证抛出错误
      await expect(
        userService.updateUser('nonexistent-id', { username: 'newname' })
      ).rejects.toThrow('用户不存在');
    });

    it('当新邮箱已被使用时应该抛出错误', async () => {
      // 准备测试数据
      const userId = 'user-123';
      const existingUser = {
        id: userId,
        email: 'old@example.com',
      };
      const anotherUser = {
        id: 'user-456',
        email: 'new@example.com',
      };

      // Mock函数行为
      (db.user.findUnique as any)
        .mockResolvedValueOnce(existingUser) // 第一次调用：查找当前用户
        .mockResolvedValueOnce(anotherUser); // 第二次调用：检查新邮箱

      // 执行测试并验证抛出错误
      await expect(
        userService.updateUser(userId, { email: 'new@example.com' })
      ).rejects.toThrow('邮箱已被使用');
    });
  });

  describe('changePassword', () => {
    it('应该成功修改密码', async () => {
      // 准备测试数据
      const userId = 'user-123';
      const oldPassword = 'oldpassword';
      const newPassword = 'newpassword123';
      const user = {
        id: userId,
        password: 'hashed-old-password',
      };

      // Mock函数行为
      (db.user.findUnique as any).mockResolvedValue(user);
      const { comparePassword } = await import('../utils/crypto');
      (comparePassword as any).mockResolvedValue(true);
      (hashPassword as any).mockResolvedValue('hashed-new-password');
      (db.user.update as any).mockResolvedValue({});

      // 执行测试
      await userService.changePassword(userId, oldPassword, newPassword);

      // 验证函数调用
      expect(comparePassword).toHaveBeenCalledWith(oldPassword, user.password);
      expect(hashPassword).toHaveBeenCalledWith(newPassword);
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: expect.objectContaining({
          password: 'hashed-new-password',
        }),
      });
    });

    it('当原密码错误时应该抛出错误', async () => {
      // 准备测试数据
      const user = {
        id: 'user-123',
        password: 'hashed-password',
      };

      // Mock函数行为
      (db.user.findUnique as any).mockResolvedValue(user);
      const { comparePassword } = await import('../utils/crypto');
      (comparePassword as any).mockResolvedValue(false);

      // 执行测试并验证抛出错误
      await expect(
        userService.changePassword('user-123', 'wrongpassword', 'newpassword123')
      ).rejects.toThrow('原密码错误');
    });

    it('当新密码长度不足时应该抛出错误', async () => {
      // 准备测试数据
      const user = {
        id: 'user-123',
        password: 'hashed-password',
      };

      // Mock函数行为
      (db.user.findUnique as any).mockResolvedValue(user);
      const { comparePassword } = await import('../utils/crypto');
      (comparePassword as any).mockResolvedValue(true);

      // 执行测试并验证抛出错误
      await expect(
        userService.changePassword('user-123', 'oldpassword', 'short')
      ).rejects.toThrow('新密码长度至少为8位');
    });
  });

  describe('getUserList', () => {
    it('应该返回用户列表和总数', async () => {
      // 准备测试数据
      const users = [
        { id: 'user-1', email: 'user1@example.com', username: 'user1' },
        { id: 'user-2', email: 'user2@example.com', username: 'user2' },
      ];
      const total = 10;

      // Mock函数行为
      (db.user.findMany as any).mockResolvedValue(users);
      (db.user.count as any).mockResolvedValue(total);

      // 执行测试
      const result = await userService.getUserList(1, 20);

      // 验证结果
      expect(result.users).toEqual(users);
      expect(result.total).toBe(total);
      expect(db.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        })
      );
    });
  });

  describe('searchUsers', () => {
    it('应该根据关键词搜索用户', async () => {
      // 准备测试数据
      const keyword = 'test';
      const users = [
        { id: 'user-1', email: 'test@example.com', username: 'testuser' },
      ];

      // Mock函数行为
      (db.user.findMany as any).mockResolvedValue(users);

      // 执行测试
      const result = await userService.searchUsers(keyword);

      // 验证结果
      expect(result).toEqual(users);
      expect(db.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
          take: 10,
        })
      );
    });
  });
});
