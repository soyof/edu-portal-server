import { ParameterizedContext as Context } from 'koa'
import { RecruitService } from '../services/recruit.service'
import { errors } from '../utils/response.utils'
import { RecruitQueryParams } from '../types/recruit.types'

export class RecruitController {
  /**
   * 获取所有招聘信息（按类型分组）
   * @param ctx Koa上下文
   */
  getRecruitmentByType = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const recruitService = new RecruitService(ctx.db)
      const params: RecruitQueryParams = {}

      const result = await recruitService.getRecruitmentByType(params)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取招聘信息失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取招聘信息失败')
    }
  }

  /**
   * 根据招聘类型获取招聘信息
   * @param ctx Koa上下文
   */
  getRecruitmentBySpecificType = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const recruitmentType = ctx.params.recruitmentType
      if (!recruitmentType) {
        ctx.status = 200
        ctx.body = errors.validationError('招聘类型不能为空')
        return
      }

      const recruitService = new RecruitService(ctx.db)
      const result = await recruitService.getRecruitmentBySpecificType(recruitmentType)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取指定类型招聘信息失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取指定类型招聘信息失败')
    }
  }
}

export default new RecruitController()
