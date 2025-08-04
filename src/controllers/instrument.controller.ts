import { ParameterizedContext as Context } from 'koa'
import { InstrumentService } from '../services/instrument.service'
import { errors } from '../utils/response.utils'
import { InstrumentQueryParams } from '../types/instrument.types'

export class InstrumentController {
  /**
   * 分页获取仪器列表（按时间倒序排序）
   * @param ctx Koa上下文
   */
  getInstrumentList = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as any
      const params: InstrumentQueryParams = {
        pageNo: body.pageNo ? parseInt(body.pageNo) : 1,
        pageSize: body.pageSize ? parseInt(body.pageSize) : 10,
        instName: body.instName,
        manufacturer: body.manufacturer,
        model: body.model
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

      const instrumentService = new InstrumentService(ctx.db)
      const result = await instrumentService.getInstrumentList(params)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取仪器列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取仪器列表失败')
    }
  }

  /**
   * 根据ID获取仪器详情
   * @param ctx Koa上下文
   */
  getInstrumentDetail = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const id = parseInt(ctx.params.id)
      if (!id || id < 1) {
        ctx.status = 200
        ctx.body = errors.validationError('仪器ID必须是有效的正整数')
        return
      }

      const instrumentService = new InstrumentService(ctx.db)
      const result = await instrumentService.getInstrumentDetail(id)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取仪器详情失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取仪器详情失败')
    }
  }
}

export default new InstrumentController()
