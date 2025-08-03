import { ParameterizedContext as Context } from 'koa'
import { ResearchService } from '../services/research.service'
import { errors } from '../utils/response.utils'
import { PaperQueryParams, PatentQueryParams, BookQueryParams } from '../types/research.types'

export class ResearchController {
  /**
   * 获取科研成果概览（论文、专利、著作各前5条）
   * @param ctx Koa上下文
   */
  getResearchOverview = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const researchService = new ResearchService(ctx.db)
      const result = await researchService.getResearchOverview()

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取科研成果概览失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取科研成果概览失败')
    }
  }

  /**
   * 分页获取论文列表
   * @param ctx Koa上下文
   */
  getPaperList = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as any
      const params: PaperQueryParams = {
        pageNo: body.pageNo ? parseInt(body.pageNo) : 1,
        pageSize: body.pageSize ? parseInt(body.pageSize) : 10,
        title: body.title,
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

      const researchService = new ResearchService(ctx.db)
      const result = await researchService.getPaperList(params)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取论文列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取论文列表失败')
    }
  }

  /**
   * 分页获取专利列表
   * @param ctx Koa上下文
   */
  getPatentList = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as any
      const params: PatentQueryParams = {
        pageNo: body.pageNo ? parseInt(body.pageNo) : 1,
        pageSize: body.pageSize ? parseInt(body.pageSize) : 10,
        title: body.title,
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

      const researchService = new ResearchService(ctx.db)
      const result = await researchService.getPatentList(params)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取专利列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取专利列表失败')
    }
  }

  /**
   * 分页获取著作列表
   * @param ctx Koa上下文
   */
  getBookList = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as any
      const params: BookQueryParams = {
        pageNo: body.pageNo ? parseInt(body.pageNo) : 1,
        pageSize: body.pageSize ? parseInt(body.pageSize) : 10,
        title: body.title,
        author: body.author,
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

      const researchService = new ResearchService(ctx.db)
      const result = await researchService.getBookList(params)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取著作列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取著作列表失败')
    }
  }

  /**
   * 根据ID获取论文详情
   * @param ctx Koa上下文
   */
  getPaperDetail = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const id = parseInt(ctx.params.id)
      if (!id || id < 1) {
        ctx.status = 200
        ctx.body = errors.validationError('论文ID必须是有效的正整数')
        return
      }

      const researchService = new ResearchService(ctx.db)
      const result = await researchService.getPaperDetail(id)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取论文详情失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取论文详情失败')
    }
  }

  /**
   * 根据ID获取专利详情
   * @param ctx Koa上下文
   */
  getPatentDetail = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const id = parseInt(ctx.params.id)
      if (!id || id < 1) {
        ctx.status = 200
        ctx.body = errors.validationError('专利ID必须是有效的正整数')
        return
      }

      const researchService = new ResearchService(ctx.db)
      const result = await researchService.getPatentDetail(id)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取专利详情失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取专利详情失败')
    }
  }

  /**
   * 根据ID获取著作详情
   * @param ctx Koa上下文
   */
  getBookDetail = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const id = parseInt(ctx.params.id)
      if (!id || id < 1) {
        ctx.status = 200
        ctx.body = errors.validationError('著作ID必须是有效的正整数')
        return
      }

      const researchService = new ResearchService(ctx.db)
      const result = await researchService.getBookDetail(id)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取著作详情失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取著作详情失败')
    }
  }
}

export default new ResearchController()
