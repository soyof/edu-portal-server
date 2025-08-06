import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import {
  NoticeListResponse,
  NoticeDetailResponse,
  NoticeQueryParams,
  PaginationResult,
  PUBLISH_STATUS,
  NOTICE_TYPES
} from '../types/notice.types'
import { formatDate } from '../utils/utils'

export class NoticeService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 分页获取通知列表（门户网站专用，只返回已发布状态）
   * @param params 查询参数（包含分页和筛选条件）
   * @returns 通知分页结果
   */
  async getNoticeList(params: NoticeQueryParams): Promise<ApiResponse<PaginationResult<NoticeListResponse>>> {
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

      // 通知类型筛选
      if (params.noticeType) {
        whereConditions.push('notice_type = ?')
        queryParams.push(params.noticeType)
      }

      // 重要程度筛选
      if (params.importance) {
        whereConditions.push('importance = ?')
        queryParams.push(params.importance)
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
        FROM notice_infos 
        WHERE ${whereClause}
      `
      const countResult = await this.dataSource.query(countSql, queryParams)
      const total = parseInt(countResult[0].total)

      // 获取分页数据（列表不返回content内容，严格按发布日期倒序排序）
      const listSql = `
        SELECT 
          id, title, title_en, notice_type, importance, link_url, publish_times
        FROM notice_infos 
        WHERE ${whereClause} 
        ORDER BY 
          publish_times DESC, 
          id DESC 
        LIMIT ? OFFSET ?
      `
      const listQueryParams = [...queryParams, pageSize, offset]
      const listResult = await this.dataSource.query(listSql, listQueryParams)

      const list: NoticeListResponse[] = listResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        noticeType: item.notice_type,
        importance: item.importance,
        linkUrl: item.link_url,
        publishTimes: item.publish_times ? formatDate(item.publish_times) : undefined
      }))

      const result: PaginationResult<NoticeListResponse> = {
        list,
        total,
        pageNo,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }

      return success(result, '获取通知列表成功')
    } catch (error: any) {
      console.error('获取通知列表失败:', error)
      return errors.serverError(error.message || '获取通知列表失败')
    }
  }

  /**
   * 根据ID获取通知详情（门户网站专用，仅支持类型2002，只返回已发布状态）
   * @param id 通知ID
   * @returns 通知详情
   */
  async getNoticeDetail(id: number): Promise<ApiResponse<NoticeDetailResponse>> {
    try {
      const sql = `
        SELECT 
          id, title, title_en, notice_type, importance, 
          content, content_en, publish_times
        FROM notice_infos 
        WHERE id = ? AND publish_status = ? AND notice_type = ?
      `
      const result = await this.dataSource.query(sql, [id, PUBLISH_STATUS.PUBLISHED, NOTICE_TYPES.TEXT])

      if (!result || result.length === 0) {
        return errors.notFound('通知不存在、未发布或不支持查看详情')
      }

      const notice = result[0]
      const noticeDetail: NoticeDetailResponse = {
        id: notice.id,
        title: notice.title,
        titleEn: notice.title_en,
        noticeType: notice.notice_type,
        importance: notice.importance,
        content: notice.content,
        contentEn: notice.content_en,
        publishTimes: notice.publish_times ? formatDate(notice.publish_times) : undefined
      }

      return success(noticeDetail, '获取通知详情成功')
    } catch (error: any) {
      console.error('获取通知详情失败:', error)
      return errors.serverError(error.message || '获取通知详情失败')
    }
  }
}
