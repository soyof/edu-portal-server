import { ParameterizedContext as Context } from 'koa'
import { UserService } from '../services/user.service'
import { errors } from '../utils/response.utils'
import { UserQueryParams } from '../types/user.types'

export class UserController {
  // 根据用户ID获取用户基本信息
  getUserInfo = async(ctx: Context): Promise<void> => {
    try {
      // 从上下文中获取数据库连接
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 获取用户ID参数
      const userId = ctx.params.userId
      if (!userId) {
        ctx.status = 200
        ctx.body = errors.validationError('用户ID不能为空')
        return
      }

      // 创建服务实例
      const userService = new UserService(ctx.db)

      // 获取用户信息
      const result = await userService.getUserInfo(userId)

      // 直接返回服务层的结果
      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取用户信息失败')
    }
  }

  // 获取用户列表（全部）
  getUserList = async(ctx: Context): Promise<void> => {
    try {
      // 从上下文中获取数据库连接
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 无需分页参数
      const params: UserQueryParams = {}

      // 创建服务实例
      const userService = new UserService(ctx.db)

      // 查询用户列表
      const result = await userService.getUserList(params)

      // 直接返回服务层的结果
      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取用户列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取用户列表失败')
    }
  }

  // 根据用户ID获取用户完整详细信息
  getUserDetail = async(ctx: Context): Promise<void> => {
    try {
      // 从上下文中获取数据库连接
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 获取用户ID参数
      const userId = ctx.params.userId
      if (!userId) {
        ctx.status = 200
        ctx.body = errors.validationError('用户ID不能为空')
        return
      }

      // 创建服务实例
      const userService = new UserService(ctx.db)

      // 获取用户详细信息
      const result = await userService.getUserDetail(userId)

      // 直接返回服务层的结果
      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取用户详细信息失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取用户详细信息失败')
    }
  }
}

export default new UserController()
