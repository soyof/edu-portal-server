import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import {
  DynamicResponse,
  DynamicQueryParams,
  PaginationResult,
  PUBLISH_STATUS
} from '../types/dynamic.types'
import { formatDate } from '../utils/utils'

export class DynamicService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 分页获取动态列表
   * @param params 查询参数（包含分页和筛选条件）
   * @returns 动态分页结果
   */
  async getDynamicList(params: DynamicQueryParams): Promise<ApiResponse<PaginationResult<DynamicResponse>>> {
    try {
      const pageNo = params.pageNo || 1
      const pageSize = params.pageSize || 10
      const offset = (pageNo - 1) * pageSize

      // 构建查询条件，使用参数化查询防止SQL注入
      const whereConditions = ['publish_status = ?']
      const queryParams: any[] = [PUBLISH_STATUS.PUBLISHED]

      // 标题搜索（防止SQL注入）
      if (params.title && params.title.trim()) {
        whereConditions.push('(title LIKE ? OR title_en LIKE ?)')
        const titleKeyword = `%${params.title.trim()}%`
        queryParams.push(titleKeyword, titleKeyword)
      }

      // 动态类型筛选
      if (params.dynamicType) {
        whereConditions.push('dynamic_type = ?')
        queryParams.push(params.dynamicType)
      }

      // 发布年份查询
      if (params.publishYear) {
        whereConditions.push('YEAR(publish_times) = ?')
        queryParams.push(params.publishYear)
      }

      // 发布月份查询
      if (params.publishMonth) {
        whereConditions.push('MONTH(publish_times) = ?')
        queryParams.push(params.publishMonth)
      }

      const whereClause = whereConditions.join(' AND ')

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM dynamic_infos 
        WHERE ${whereClause}
      `
      const countResult = await this.dataSource.query(countSql, queryParams)
      const total = parseInt(countResult[0].total)

      // 获取分页数据
      const listSql = `
        SELECT 
          id, title, title_en, dynamic_type, publish_times
        FROM dynamic_infos 
        WHERE ${whereClause} 
        ORDER BY 
          COALESCE(publish_times, created_times) DESC, 
          id DESC 
        LIMIT ? OFFSET ?
      `
      const listQueryParams = [...queryParams, pageSize, offset]
      const listResult = await this.dataSource.query(listSql, listQueryParams)

      const list: DynamicResponse[] = listResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        dynamicType: item.dynamic_type,
        content: undefined, // 列表不返回内容，节省带宽
        contentEn: undefined,
        publishTimes: item.publish_times ? formatDate(item.publish_times) : undefined
      }))

      const result: PaginationResult<DynamicResponse> = {
        list,
        total,
        pageNo,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }

      return success(result, '获取动态列表成功')
    } catch (error: any) {
      console.error('获取动态列表失败:', error)
      return errors.serverError(error.message || '获取动态列表失败')
    }
  }

  /**
   * 根据ID获取动态详情
   * @param id 动态ID
   * @returns 动态详情
   */
  async getDynamicDetail(id: number): Promise<ApiResponse<DynamicResponse>> {
    try {
      const sql = `
        SELECT 
          id, title, title_en, dynamic_type, content, content_en, publish_times
        FROM dynamic_infos 
        WHERE id = ? AND publish_status = ?
      `
      const result = await this.dataSource.query(sql, [id, PUBLISH_STATUS.PUBLISHED])

      if (!result || result.length === 0) {
        return errors.notFound('动态不存在或未发布')
      }

      const dynamic = result[0]
      const dynamicDetail: DynamicResponse = {
        id: dynamic.id,
        title: dynamic.title,
        titleEn: dynamic.title_en,
        dynamicType: dynamic.dynamic_type,
        content: dynamic.content,
        contentEn: dynamic.content_en,
        publishTimes: dynamic.publish_times ? formatDate(dynamic.publish_times) : undefined
      }

      return success(dynamicDetail, '获取动态详情成功')
    } catch (error: any) {
      console.error('获取动态详情失败:', error)
      return errors.serverError(error.message || '获取动态详情失败')
    }
  }
}
