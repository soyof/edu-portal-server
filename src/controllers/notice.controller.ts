import { ParameterizedContext as Context } from 'koa'
import { NoticeService } from '../services/notice.service'
import { errors } from '../utils/response.utils'
import { NoticeQueryParams } from '../types/notice.types'

export class NoticeController {
  /**
   * 分页获取通知列表（严格按发布日期倒序排序）
   * @param ctx Koa上下文
   */
  getNoticeList = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as any
      const params: NoticeQueryParams = {
        pageNo: body.pageNo ? parseInt(body.pageNo) : 1,
        pageSize: body.pageSize ? parseInt(body.pageSize) : 10,
        title: body.title,
        noticeType: body.noticeType,
        importance: body.importance
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

      // 通知类型验证
      if (params.noticeType && !['2001', '2002'].includes(params.noticeType)) {
        ctx.status = 200
        ctx.body = errors.validationError('通知类型必须是2001(超链接)或2002(文本)')
        return
      }

      // 重要程度验证
      if (params.importance && !['3001', '3002', '3003'].includes(params.importance)) {
        ctx.status = 200
        ctx.body = errors.validationError('重要程度必须是3001(普通)、3002(重要)或3003(紧急)')
        return
      }

      const noticeService = new NoticeService(ctx.db)
      const result = await noticeService.getNoticeList(params)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取通知列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取通知列表失败')
    }
  }

  /**
   * 根据ID获取通知详情（仅支持类型2002的文本通知）
   * @param ctx Koa上下文
   */
  getNoticeDetail = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const id = parseInt(ctx.params.id)
      if (!id || id < 1) {
        ctx.status = 200
        ctx.body = errors.validationError('通知ID必须是有效的正整数')
        return
      }

      const noticeService = new NoticeService(ctx.db)
      const result = await noticeService.getNoticeDetail(id)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取通知详情失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取通知详情失败')
    }
  }
}

export default new NoticeController()
