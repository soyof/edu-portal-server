import { ParameterizedContext as Context } from 'koa'
import { DynamicService } from '../services/dynamic.service'
import { errors } from '../utils/response.utils'
import { DynamicQueryParams } from '../types/dynamic.types'

export class DynamicController {
  /**
   * 分页获取所有动态列表（按时间倒序排序）
   * @param ctx Koa上下文
   */
  getDynamicList = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as any
      const params: DynamicQueryParams = {
        pageNo: body.pageNo ? parseInt(body.pageNo) : 1,
        pageSize: body.pageSize ? parseInt(body.pageSize) : 10,
        title: body.title,
        dynamicType: body.dynamicType,
        publishYear: body.publishYear ? parseInt(body.publishYear) : undefined,
        publishMonth: body.publishMonth ? parseInt(body.publishMonth) : undefined
      }

      // 参数验证
      if (params.pageNo && params.pageNo < 1) {
        ctx.status = 200
        ctx.body = errors.validationError('页码必须大于0')
        return
      }

      if (params.pageSize && (params.pageSize < 1 || params.pageSize > 100)) {
        ctx.status = 200
        ctx.body = errors.validationError('每页数量必须在1-100之间')
        return
      }

      if (params.publishMonth && (params.publishMonth < 1 || params.publishMonth > 12)) {
        ctx.status = 200
        ctx.body = errors.validationError('月份必须在1-12之间')
        return
      }

      // 动态类型验证
      if (params.dynamicType && !['6001', '6002'].includes(params.dynamicType)) {
        ctx.status = 200
        ctx.body = errors.validationError('动态类型必须是6001(科研动态)或6002(新闻动态)')
        return
      }

      const dynamicService = new DynamicService(ctx.db)
      const result = await dynamicService.getDynamicList(params)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取动态列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取动态列表失败')
    }
  }

  /**
   * 根据ID获取动态详情
   * @param ctx Koa上下文
   */
  getDynamicDetail = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const id = parseInt(ctx.params.id)
      if (!id || id < 1) {
        ctx.status = 200
        ctx.body = errors.validationError('动态ID必须是有效的正整数')
        return
      }

      const dynamicService = new DynamicService(ctx.db)
      const result = await dynamicService.getDynamicDetail(id)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取动态详情失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取动态详情失败')
    }
  }
}

export default new DynamicController()
