/**
 * 用户服务模块
 * 负责处理用户相关的业务逻辑
 */

import { User, UserCreateInput, UserUpdateInput } from '../types/user';
import { db } from '../database/connection';
import { hashPassword, comparePassword } from '../utils/crypto';
import { generateToken } from '../utils/jwt';

/**
 * 用户服务类
 */
export class UserService {
  /**
   * 创建新用户
   * @param userData 用户数据
   * @returns 创建的用户信息（不包含密码）
   */
  async createUser(userData: UserCreateInput): Promise<User> {
    // 检查用户是否已存在
    const existingUser = await db.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('用户已存在');
    }

    // 密码加密
    const hashedPassword = await hashPassword(userData.password);

    // 创建用户
    const user = await db.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        phone: userData.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 移除密码字段
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * 用户登录
   * @param email 邮箱
   * @param password 密码
   * @returns 用户信息和访问令牌
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // 查找用户
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 生成访问令牌
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // 更新最后登录时间
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token,
    };
  }

  /**
   * 根据ID获取用户信息
   * @param userId 用户ID
   * @returns 用户信息
   */
  async getUserById(userId: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    return user;
  }

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param updateData 更新数据
   * @returns 更新后的用户信息
   */
  async updateUser(userId: string, updateData: UserUpdateInput): Promise<User> {
    // 检查用户是否存在
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error('用户不存在');
    }

    // 如果更新邮箱，检查新邮箱是否已被使用
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailInUse = await db.user.findUnique({
        where: { email: updateData.email },
      });

      if (emailInUse) {
        throw new Error('邮箱已被使用');
      }
    }

    // 更新用户信息
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * 修改用户密码
   * @param userId 用户ID
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    // 获取用户信息（包含密码）
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证旧密码
    const isOldPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new Error('原密码错误');
    }

    // 密码强度验证
    if (newPassword.length < 8) {
      throw new Error('新密码长度至少为8位');
    }

    // 加密新密码
    const hashedNewPassword = await hashPassword(newPassword);

    // 更新密码
    await db.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * 删除用户
   * @param userId 用户ID
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 软删除：标记为已删除而不是真正删除
    await db.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  /**
   * 获取用户列表（分页）
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 用户列表和总数
   */
  async getUserList(
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      db.user.findMany({
        skip,
        take: pageSize,
        where: {
          deletedAt: null,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          username: true,
          phone: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      db.user.count({
        where: {
          deletedAt: null,
          isActive: true,
        },
      }),
    ]);

    return { users, total };
  }

  /**
   * 搜索用户
   * @param keyword 搜索关键词
   * @returns 匹配的用户列表
   */
  async searchUsers(keyword: string): Promise<User[]> {
    const users = await db.user.findMany({
      where: {
        OR: [
          { email: { contains: keyword } },
          { username: { contains: keyword } },
          { phone: { contains: keyword } },
        ],
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
      take: 10,
    });

    return users;
  }
}

// 导出单例
export const userService = new UserService();
