import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import { DictQueryParams, DictResponse } from '../types/dict.types'
import { formatDate } from '../utils/utils'

// 字典服务类
export class DictService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 根据字典类型获取字典列表
   * @param params 查询参数
   * @returns 字典列表
   */
  async getDictByType(params: DictQueryParams): Promise<ApiResponse<DictResponse[]>> {
    try {
      // 构建SQL查询
      const sql = `
        SELECT 
          d.dict_id,
          d.dict_type,
          d.dict_type_name,
          d.dict_value,
          d.dict_value_en,
          d.sort_order,
          d.remark,
          d.created_times,
          d.updated_times
        FROM sys_dict d
        WHERE d.dict_type = ? AND d.status = 1
        ORDER BY d.sort_order ASC, d.created_times ASC
      `

      const queryResult = await this.dataSource.query(sql, [params.dictType])

      // 处理返回数据
      const list: DictResponse[] = queryResult.map((dict: any) => ({
        dictId: dict.dict_id,
        dictType: dict.dict_type,
        dictTypeName: dict.dict_type_name,
        dictValue: dict.dict_value,
        dictValueEn: dict.dict_value_en,
        sortOrder: dict.sort_order,
        remark: dict.remark,
        createdTimes: formatDate(dict.created_times),
        updatedTimes: formatDate(dict.updated_times)
      }))

      return success(list, '获取字典数据成功')
    } catch (error: any) {
      console.error('获取字典数据失败:', error)
      return errors.serverError(error.message || '获取字典数据失败')
    }
  }

  /**
   * 获取所有字典类型列表
   * @returns 字典类型列表
   */
  async getDictTypes(): Promise<ApiResponse<{ dictType: string; dictTypeName: string }[]>> {
    try {
      // 查询所有不重复的字典类型
      const sql = `
        SELECT DISTINCT 
          d.dict_type,
          d.dict_type_name
        FROM sys_dict d
        WHERE d.status = 1
        ORDER BY d.dict_type ASC
      `

      const queryResult = await this.dataSource.query(sql)

      const list = queryResult.map((item: any) => ({
        dictType: item.dict_type,
        dictTypeName: item.dict_type_name
      }))

      return success(list, '获取字典类型列表成功')
    } catch (error: any) {
      console.error('获取字典类型列表失败:', error)
      return errors.serverError(error.message || '获取字典类型列表失败')
    }
  }
}
