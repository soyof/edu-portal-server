import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import {
  ToolResponse,
  ToolQueryParams,
  PaginationResult,
  PUBLISH_STATUS
} from '../types/tool.types'
import { formatDate } from '../utils/utils'

export class ToolService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 分页获取科研工具列表（门户网站专用，只返回已发布状态）
   * @param params 查询参数（包含分页和筛选条件）
   * @returns 科研工具分页结果
   */
  async getToolList(params: ToolQueryParams): Promise<ApiResponse<PaginationResult<ToolResponse>>> {
    try {
      const pageNo = params.pageNo || 1
      const pageSize = params.pageSize || 10
      const offset = (pageNo - 1) * pageSize

      // 构建查询条件，写死只返回已发布状态（门户网站专用）
      const whereConditions = ['publish_status = ?']
      const queryParams: any[] = [PUBLISH_STATUS.PUBLISHED] // 固定为已发布状态

      // 标题搜索（防止SQL注入）
      if (params.title && params.title.trim()) {
        whereConditions.push('(title LIKE ? OR title_en LIKE ?)')
        const titleKeyword = `%${params.title.trim()}%`
        queryParams.push(titleKeyword, titleKeyword)
      }

      // 工具类型筛选
      if (params.toolType) {
        whereConditions.push('tool_type = ?')
        queryParams.push(params.toolType)
      }

      // 发布年份筛选
      if (params.publishYear) {
        whereConditions.push('YEAR(publish_times) = ?')
        queryParams.push(params.publishYear)
      }

      // 发布月份筛选
      if (params.publishMonth) {
        whereConditions.push('MONTH(publish_times) = ?')
        queryParams.push(params.publishMonth)
      }

      const whereClause = whereConditions.join(' AND ')

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM tool_infos 
        WHERE ${whereClause}
      `
      const countResult = await this.dataSource.query(countSql, queryParams)
      const total = parseInt(countResult[0].total)

      // 获取分页数据（按发布时间倒序排序）
      const listSql = `
        SELECT 
          id, title, title_en, description, description_en, 
          tool_type, tool_url, publish_times
        FROM tool_infos 
        WHERE ${whereClause} 
        ORDER BY 
          publish_times DESC, 
          created_times DESC, 
          id DESC 
        LIMIT ? OFFSET ?
      `
      const listQueryParams = [...queryParams, pageSize, offset]
      const listResult = await this.dataSource.query(listSql, listQueryParams)

      const list: ToolResponse[] = listResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        description: item.description,
        descriptionEn: item.description_en,
        toolType: item.tool_type,
        toolUrl: item.tool_url,
        publishTimes: item.publish_times ? formatDate(item.publish_times) : undefined
      }))

      const result: PaginationResult<ToolResponse> = {
        list,
        total,
        pageNo,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }

      return success(result, '获取科研工具列表成功')
    } catch (error: any) {
      console.error('获取科研工具列表失败:', error)
      return errors.serverError(error.message || '获取科研工具列表失败')
    }
  }
}
