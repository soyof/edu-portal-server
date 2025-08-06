import { ParameterizedContext as Context } from 'koa'
import { ToolService } from '../services/tool.service'
import { errors } from '../utils/response.utils'
import { ToolQueryParams } from '../types/tool.types'

export class ToolController {
  /**
   * 分页获取科研工具列表（按发布时间倒序排序）
   * @param ctx Koa上下文
   */
  getToolList = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as any
      const params: ToolQueryParams = {
        pageNo: body.pageNo ? parseInt(body.pageNo) : 1,
        pageSize: body.pageSize ? parseInt(body.pageSize) : 10,
        title: body.title,
        toolType: body.toolType,
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

      // 发布月份验证
      if (params.publishMonth && (params.publishMonth < 1 || params.publishMonth > 12)) {
        ctx.status = 200
        ctx.body = errors.validationError('发布月份必须在1-12之间')
        return
      }

      // 发布年份验证（限制合理的年份范围）
      if (params.publishYear && (params.publishYear < 1900 || params.publishYear > new Date().getFullYear() + 10)) {
        ctx.status = 200
        ctx.body = errors.validationError('发布年份必须在合理范围内')
        return
      }

      const toolService = new ToolService(ctx.db)
      const result = await toolService.getToolList(params)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取科研工具列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取科研工具列表失败')
    }
  }
}

export default new ToolController()
