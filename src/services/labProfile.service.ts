import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import { LabProfileQueryParams, LabProfileResponse, PaginationResult, LabProfileCreateUpdateParams } from '../types/labProfile.types'
import { formatDate } from '../utils/utils'
import { LabProfile } from '../models/LabProfile'

// 实验室简介服务类
export class LabProfileService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 查询实验室简介列表（分页）
   * @param params 查询参数
   * @returns 简介列表
   */
  async getLabProfileList(params: LabProfileQueryParams): Promise<ApiResponse<PaginationResult<LabProfileResponse>>> {
    try {
      // 默认值处理
      const pageNo = params.pageNo || 1
      const pageSize = params.pageSize || 20
      const skip = (pageNo - 1) * pageSize

      // 构建SQL查询条件
      const conditions: string[] = []
      const queryParams: any[] = []

      // 简介类型
      if (params.profileType !== undefined && params.profileType !== '') {
        conditions.push('lp.profile_type = ?')
        queryParams.push(params.profileType)
      }

      // 简介标题
      if (params.title) {
        conditions.push('lp.title LIKE ?')
        queryParams.push(`%${params.title}%`)
      }

      // 发布状态
      if (params.publishStatus !== undefined && params.publishStatus !== '') {
        conditions.push('lp.publish_status = ?')
        queryParams.push(params.publishStatus.toString())
      }

      // 创建人(模糊查询，可以是用户ID或用户名称)
      if (params.createUserId) {
        conditions.push('(lp.create_user_id LIKE ? OR create_user.username LIKE ?)')
        queryParams.push(`%${params.createUserId}%`, `%${params.createUserId}%`)
      }

      // 更新人(模糊查询，可以是用户ID或用户名称)
      if (params.updateUserId) {
        conditions.push('(lp.update_user_id LIKE ? OR update_user.username LIKE ?)')
        queryParams.push(`%${params.updateUserId}%`, `%${params.updateUserId}%`)
      }

      // 发布人(模糊查询，可以是用户ID或用户名称)
      if (params.publishUserId) {
        conditions.push('(lp.publish_user_id LIKE ? OR publish_user.username LIKE ?)')
        queryParams.push(`%${params.publishUserId}%`, `%${params.publishUserId}%`)
      }

      // 发布时间范围
      if (params.publishTimesRange && params.publishTimesRange.length === 2) {
        const [startDate, endDate] = params.publishTimesRange
        if (startDate && endDate) {
          conditions.push('lp.publish_times BETWEEN ? AND ?')
          queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`)
        }
      }

      // 更新时间范围
      if (params.updatedTimesRange && params.updatedTimesRange.length === 2) {
        const [startDate, endDate] = params.updatedTimesRange
        if (startDate && endDate) {
          conditions.push('lp.updated_times BETWEEN ? AND ?')
          queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`)
        }
      }

      // 构建WHERE子句
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

      // 构建联合查询SQL - 联合用户表获取创建人和更新人的用户名
      const sql = `
        SELECT 
          lp.*,
          create_user.username AS create_user_name,
          update_user.username AS update_user_name,
          publish_user.username AS publish_user_name
        FROM 
          lab_profile_infos lp
        LEFT JOIN 
          user_infos create_user ON lp.create_user_id = create_user.user_id
        LEFT JOIN 
          user_infos update_user ON lp.update_user_id = update_user.user_id
        LEFT JOIN 
          user_infos publish_user ON lp.publish_user_id = publish_user.user_id
        ${whereClause}
        ORDER BY lp.updated_times DESC
        LIMIT ? OFFSET ?
      `
      queryParams.push(pageSize, skip)

      // 执行查询
      const profiles = await this.dataSource.query(sql, queryParams)

      // 获取总记录数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM lab_profile_infos lp
        LEFT JOIN user_infos create_user ON lp.create_user_id = create_user.user_id
        LEFT JOIN user_infos update_user ON lp.update_user_id = update_user.user_id
        LEFT JOIN user_infos publish_user ON lp.publish_user_id = publish_user.user_id
        ${whereClause}
      `
      const countResult = await this.dataSource.query(countSql, queryParams.slice(0, -2))
      const total = Number(countResult[0].total)

      // 计算总页数
      const pages = Math.ceil(total / pageSize)

      // 转换为前端格式
      const records = profiles.map((item: any) => ({
        id: item.id,
        profileType: item.profile_type,
        title: item.title,
        content: item.content,
        contentEn: item.content_en,
        publishTimes: item.publish_times ? formatDate(new Date(item.publish_times)) : undefined,
        publishUserId: item.publish_user_id,
        publishUserName: item.publish_user_name || (item.publish_user_id ? '未知用户' : undefined),
        createUserId: item.create_user_id,
        updateUserId: item.update_user_id,
        createUserName: item.create_user_name || '未知用户',
        updateUserName: item.update_user_name || '未知用户',
        publishStatus: item.publish_status || '0',
        createdTimes: formatDate(new Date(item.created_times)),
        updatedTimes: formatDate(new Date(item.updated_times))
      }))

      // 返回结果
      return success<PaginationResult<LabProfileResponse>>({
        list: records,
        total,
        pages,
        pageNo,
        pageSize
      })
    } catch (error: any) {
      console.error('获取实验室简介列表失败:', error)
      return errors.serverError<PaginationResult<LabProfileResponse>>(error.message || '获取实验室简介列表失败')
    }
  }

  /**
   * 获取实验室简介详情
   * @param id 简介ID
   * @returns 简介详情
   */
  async getLabProfileDetail(id: number): Promise<ApiResponse<LabProfileResponse>> {
    try {
      // 构建联合查询SQL
      const sql = `
        SELECT 
          lp.*,
          create_user.username AS create_user_name,
          update_user.username AS update_user_name,
          publish_user.username AS publish_user_name
        FROM 
          lab_profile_infos lp
        LEFT JOIN 
          user_infos create_user ON lp.create_user_id = create_user.user_id
        LEFT JOIN 
          user_infos update_user ON lp.update_user_id = update_user.user_id
        LEFT JOIN 
          user_infos publish_user ON lp.publish_user_id = publish_user.user_id
        WHERE lp.id = ?
      `

      // 执行查询
      const profiles = await this.dataSource.query(sql, [id])

      // 检查是否找到简介
      if (!profiles || profiles.length === 0) {
        return errors.notFound<LabProfileResponse>('未找到该实验室简介')
      }

      // 获取简介信息
      const profile = profiles[0]

      // 转换为前端格式
      const result: LabProfileResponse = {
        id: profile.id,
        profileType: profile.profile_type,
        title: profile.title,
        content: profile.content,
        contentEn: profile.content_en,
        publishTimes: profile.publish_times ? formatDate(new Date(profile.publish_times)) : undefined,
        publishUserId: profile.publish_user_id,
        publishUserName: profile.publish_user_name || (profile.publish_user_id ? '未知用户' : undefined),
        createUserId: profile.create_user_id,
        updateUserId: profile.update_user_id,
        createUserName: profile.create_user_name || '未知用户',
        updateUserName: profile.update_user_name || '未知用户',
        publishStatus: profile.publish_status || '0',
        createdTimes: formatDate(new Date(profile.created_times)),
        updatedTimes: formatDate(new Date(profile.updated_times))
      }

      return success(result)
    } catch (error: any) {
      console.error('获取实验室简介详情失败:', error)
      return errors.serverError<LabProfileResponse>(error.message || '获取实验室简介详情失败')
    }
  }

  /**
   * 创建或更新实验室简介
   * @param params 简介参数
   * @param userId 当前用户ID
   * @returns 操作结果
   */
  async createOrUpdateLabProfile(params: LabProfileCreateUpdateParams, userId: string): Promise<ApiResponse<LabProfileResponse>> {
    try {
      // 判断是新增还是修改
      if (params.id) {
        // 修改简介
        // 先查询简介是否存在
        const existingProfile = await this.dataSource.getRepository(LabProfile).findOne({ where: { id: params.id }})

        if (!existingProfile) {
          return errors.notFound<LabProfileResponse>('实验室简介不存在')
        }

        // 检查简介是否已发布，已发布的简介不允许修改
        if (existingProfile.publish_status === '1') {
          return errors.validationError<LabProfileResponse>('已发布的简介不能修改，请先取消发布后再修改')
        }

        // 更新简介信息
        existingProfile.profile_type = params.profileType
        existingProfile.title = params.title
        existingProfile.content = params.content
        existingProfile.content_en = params.contentEn
        existingProfile.update_user_id = userId

        // 保存更新后的简介
        await this.dataSource.getRepository(LabProfile).save(existingProfile)

        // 查询更新后的简介详情
        return this.getLabProfileDetail(params.id)
      }
      // 新增简介
      const newProfile = new LabProfile()
      newProfile.profile_type = params.profileType
      newProfile.title = params.title
      newProfile.content = params.content
      newProfile.content_en = params.contentEn
      newProfile.publish_status = '0' // 新增时默认为未发布状态
      newProfile.create_user_id = userId
      newProfile.update_user_id = userId

      // 保存新简介
      const savedProfile = await this.dataSource.getRepository(LabProfile).save(newProfile)

      // 查询新增的简介详情
      return this.getLabProfileDetail(savedProfile.id)
    } catch (error: any) {
      console.error('创建或更新实验室简介失败:', error)
      return errors.serverError<LabProfileResponse>(error.message || '创建或更新实验室简介失败')
    }
  }

  /**
   * 发布或下线实验室简介
   * @param id 简介ID
   * @param action 操作类型：publish（发布）或unpublish（下线）
   * @param userId 当前用户ID
   * @returns 操作结果
   */
  async publishOrUnpublishLabProfile(id: number, action: string, userId: string): Promise<ApiResponse<LabProfileResponse>> {
    try {
      // 查询简介是否存在
      const profile = await this.dataSource.getRepository(LabProfile).findOne({ where: { id }})

      if (!profile) {
        return errors.notFound<LabProfileResponse>('实验室简介不存在')
      }

      // 根据操作类型设置发布状态
      if (action === 'publish') {
        // 发布操作
        if (profile.publish_status === '1') {
          return errors.validationError<LabProfileResponse>('该简介已经是发布状态')
        }

        // 先将同类型的其他已发布的简介置为已下线状态
        await this.dataSource.getRepository(LabProfile)
          .createQueryBuilder()
          .update(LabProfile)
          .set({
            publish_status: '2', // 已下线
            update_user_id: userId
          })
          .where('profile_type = :profileType AND id != :id AND publish_status = :publishStatus',
            { profileType: profile.profile_type, id: id, publishStatus: '1' })
          .execute()

        // 更新状态为已发布
        profile.publish_status = '1'
        profile.publish_times = new Date()
        profile.publish_user_id = userId
        profile.update_user_id = userId

        await this.dataSource.getRepository(LabProfile).save(profile)
      } else if (action === 'unpublish') {
        // 下线操作
        if (profile.publish_status !== '1') {
          return errors.validationError<LabProfileResponse>('只有已发布的简介可以下线')
        }

        // 更新状态为已下线
        profile.publish_status = '2'
        profile.update_user_id = userId

        await this.dataSource.getRepository(LabProfile).save(profile)
      } else {
        return errors.validationError<LabProfileResponse>('无效的操作类型')
      }

      // 返回更新后的简介详情
      return this.getLabProfileDetail(id)
    } catch (error: any) {
      console.error('发布或下线实验室简介失败:', error)
      return errors.serverError<LabProfileResponse>(error.message || '发布或下线实验室简介失败')
    }
  }

  /**
   * 删除实验室简介（单个或批量）
   * @param ids 简介ID数组
   * @returns 操作结果
   */
  async deleteLabProfiles(ids: number[]): Promise<ApiResponse<{ successCount: number; failCount: number }>> {
    try {
      let successCount = 0
      let failCount = 0

      // 遍历处理每个ID
      for (const id of ids) {
        try {
          // 查询简介
          const profile = await this.dataSource.getRepository(LabProfile).findOne({ where: { id }})

          // 如果简介不存在或已发布，则跳过
          if (!profile) {
            failCount++
            continue
          }

          if (profile.publish_status === '1') {
            failCount++
            continue
          }

          // 删除简介
          await this.dataSource.getRepository(LabProfile).delete(id)
          successCount++
        } catch (err) {
          failCount++
        }
      }

      return success({ successCount, failCount })
    } catch (error: any) {
      console.error('删除实验室简介失败:', error)
      return errors.serverError<{ successCount: number; failCount: number }>(error.message || '删除实验室简介失败')
    }
  }
}
