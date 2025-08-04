import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import {
  InstrumentListResponse,
  InstrumentDetailResponse,
  InstrumentQueryParams,
  PaginationResult,
  PUBLISH_STATUS
} from '../types/instrument.types'
import { formatDate } from '../utils/utils'

export class InstrumentService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 分页获取仪器列表
   * @param params 查询参数（包含分页和筛选条件）
   * @returns 仪器分页结果
   */
  async getInstrumentList(params: InstrumentQueryParams): Promise<ApiResponse<PaginationResult<InstrumentListResponse>>> {
    try {
      const pageNo = params.pageNo || 1
      const pageSize = params.pageSize || 10
      const offset = (pageNo - 1) * pageSize

      // 构建查询条件，使用参数化查询防止SQL注入
      const whereConditions = ['publish_status = ?']
      const queryParams: any[] = [PUBLISH_STATUS.PUBLISHED]

      // 仪器名称搜索（防止SQL注入）
      if (params.instName && params.instName.trim()) {
        whereConditions.push('(inst_name LIKE ? OR inst_name_en LIKE ?)')
        const nameKeyword = `%${params.instName.trim()}%`
        queryParams.push(nameKeyword, nameKeyword)
      }

      // 生产厂家搜索（防止SQL注入）
      if (params.manufacturer && params.manufacturer.trim()) {
        whereConditions.push('(manufacturer LIKE ? OR manufacturer_en LIKE ?)')
        const manufacturerKeyword = `%${params.manufacturer.trim()}%`
        queryParams.push(manufacturerKeyword, manufacturerKeyword)
      }

      // 型号搜索（防止SQL注入）
      if (params.model && params.model.trim()) {
        whereConditions.push('model LIKE ?')
        const modelKeyword = `%${params.model.trim()}%`
        queryParams.push(modelKeyword)
      }

      const whereClause = whereConditions.join(' AND ')

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM instruments_infos 
        WHERE ${whereClause}
      `
      const countResult = await this.dataSource.query(countSql, queryParams)
      const total = parseInt(countResult[0].total)

      // 获取分页数据（列表不返回text相关内容，按发布日期倒序排序）
      const listSql = `
        SELECT 
          id, inst_name, inst_name_en, manufacturer, manufacturer_en, 
          model, image_files, publish_times
        FROM instruments_infos 
        WHERE ${whereClause} 
        ORDER BY 
          publish_times DESC, 
          created_times DESC, 
          id DESC 
        LIMIT ? OFFSET ?
      `
      const listQueryParams = [...queryParams, pageSize, offset]
      const listResult = await this.dataSource.query(listSql, listQueryParams)
      console.log(listResult)

      const list: InstrumentListResponse[] = listResult.map((item: any) => ({
        id: item.id,
        instName: item.inst_name,
        instNameEn: item.inst_name_en,
        manufacturer: item.manufacturer,
        manufacturerEn: item.manufacturer_en,
        model: item.model,
        imageFiles: item.image_files ? item.image_files : [],
        publishTimes: item.publish_times ? formatDate(item.publish_times) : undefined
      }))

      const result: PaginationResult<InstrumentListResponse> = {
        list,
        total,
        pageNo,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }

      return success(result, '获取仪器列表成功')
    } catch (error: any) {
      console.error('获取仪器列表失败:', error)
      return errors.serverError(error.message || '获取仪器列表失败')
    }
  }

  /**
   * 根据ID获取仪器详情
   * @param id 仪器ID
   * @returns 仪器详情
   */
  async getInstrumentDetail(id: number): Promise<ApiResponse<InstrumentDetailResponse>> {
    try {
      const sql = `
        SELECT 
          id, inst_name, inst_name_en, manufacturer, manufacturer_en, 
          model, working_principle, working_principle_en, application_scope, 
          application_scope_en, performance_features, performance_features_en,
          other_info, other_info_en, image_files, publish_times
        FROM instruments_infos 
        WHERE id = ? AND publish_status = ?
      `
      const result = await this.dataSource.query(sql, [id, PUBLISH_STATUS.PUBLISHED])

      if (!result || result.length === 0) {
        return errors.notFound('仪器不存在或未发布')
      }

      const instrument = result[0]
      const instrumentDetail: InstrumentDetailResponse = {
        id: instrument.id,
        instName: instrument.inst_name,
        instNameEn: instrument.inst_name_en,
        manufacturer: instrument.manufacturer,
        manufacturerEn: instrument.manufacturer_en,
        model: instrument.model,
        workingPrinciple: instrument.working_principle,
        workingPrincipleEn: instrument.working_principle_en,
        applicationScope: instrument.application_scope,
        applicationScopeEn: instrument.application_scope_en,
        performanceFeatures: instrument.performance_features,
        performanceFeaturesEn: instrument.performance_features_en,
        otherInfo: instrument.other_info,
        otherInfoEn: instrument.other_info_en,
        imageFiles: instrument.image_files ? instrument.image_files : [],
        publishTimes: instrument.publish_times ? formatDate(instrument.publish_times) : undefined
      }

      return success(instrumentDetail, '获取仪器详情成功')
    } catch (error: any) {
      console.error('获取仪器详情失败:', error)
      return errors.serverError(error.message || '获取仪器详情失败')
    }
  }
}
