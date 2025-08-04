import { ParameterizedContext as Context } from 'koa'
import { LabProfileService } from '../services/labProfile.service'
import { success, errors } from '../utils/response.utils'
import { LabProfileQueryParams } from '../types/labProfile.types'

export class LabProfileController {
  // 获取研究所简介信息（门户网站专用接口）
  getInstituteProfileForPortal = async(ctx: Context): Promise<void> => {
    try {
      // 从上下文中获取数据库连接
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 创建服务实例
      const labProfileService = new LabProfileService(ctx.db)

      // 查询已发布的研究所简介（profileType: '5001', publishStatus: '1'）
      const params: LabProfileQueryParams = {
        profileType: '5001', // 研究所简介
        publishStatus: '1', // 已发布
        pageNo: 1,
        pageSize: 1
      }

      const result = await labProfileService.getLabProfileList(params)

      // 如果有数据，返回第一条记录的简化信息
      if (result && result.data && result.data.list && result.data.list.length > 0) {
        const profile = result.data.list[0]
        const profileData = {
          id: profile.id,
          title: profile.title,
          content: profile.content,
          contentEn: profile.contentEn,
          publishTimes: profile.publishTimes,
          updatedTimes: profile.updatedTimes
        }
        ctx.status = 200
        ctx.body = success(profileData, '获取研究所简介成功')
      } else {
        ctx.status = 200
        ctx.body = success(null, '暂无研究所简介信息')
      }
    } catch (error: any) {
      console.error('获取研究所简介失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取研究所简介失败')
    }
  }

  // 获取实验室环境简介信息（门户网站专用接口）
  getLabEnvironmentProfileForPortal = async(ctx: Context): Promise<void> => {
    try {
      // 从上下文中获取数据库连接
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 创建服务实例
      const labProfileService = new LabProfileService(ctx.db)

      // 查询已发布的实验室环境简介（profileType: '5002', publishStatus: '1'）
      const params: LabProfileQueryParams = {
        profileType: '5002', // 实验室环境简介
        publishStatus: '1', // 已发布
        pageNo: 1,
        pageSize: 1
      }

      const result = await labProfileService.getLabProfileList(params)

      // 如果有数据，返回第一条记录的简化信息
      if (result && result.data && result.data.list && result.data.list.length > 0) {
        const profile = result.data.list[0]
        const profileData = {
          id: profile.id,
          title: profile.title,
          content: profile.content,
          contentEn: profile.contentEn,
          publishTimes: profile.publishTimes,
          updatedTimes: profile.updatedTimes
        }
        ctx.status = 200
        ctx.body = success(profileData, '获取实验室环境简介成功')
      } else {
        ctx.status = 200
        ctx.body = success(null, '暂无实验室环境简介信息')
      }
    } catch (error: any) {
      console.error('获取实验室环境简介失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取实验室环境简介失败')
    }
  }

  // 通用获取简介信息接口（根据传入的profileType查询已发布的简介）
  getProfileByType = async(ctx: Context): Promise<void> => {
    try {
      // 从上下文中获取数据库连接
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 获取请求体中的profileType
      const body = ctx.request.body as any
      const profileType = body.profileType

      // 参数验证
      if (!profileType) {
        ctx.status = 200
        ctx.body = errors.validationError('profileType参数必须提供')
        return
      }

      // 创建服务实例
      const labProfileService = new LabProfileService(ctx.db)

      // 直接根据类型获取已发布的简介（不使用分页）
      const result = await labProfileService.getPublishedProfileByType(profileType)

      // 处理结果
      if (result && result.data) {
        // 返回简化的数据结构（门户网站专用）
        const profileData = {
          id: result.data.id,
          profileType: result.data.profileType,
          title: result.data.title,
          content: result.data.content,
          contentEn: result.data.contentEn,
          publishTimes: result.data.publishTimes,
          updatedTimes: result.data.updatedTimes
        }
        ctx.status = 200
        ctx.body = success(profileData, result.message || '获取简介信息成功')
      } else {
        ctx.status = 200
        ctx.body = success(null, result?.message || '暂无该类型的简介信息')
      }
    } catch (error: any) {
      console.error('获取简介信息失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取简介信息失败')
    }
  }
}

export default new LabProfileController()
