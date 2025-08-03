import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import { RecruitQueryParams, RecruitResponse, RecruitmentByTypeResponse } from '../types/recruit.types'
import { formatDate } from '../utils/utils'

export class RecruitService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 获取招聘信息列表（按类型分组）
   * 只获取生效中的数据，按recruitment_type分类
   * @param params 查询参数
   * @returns 按类型分组的招聘信息列表
   */
  async getRecruitmentByType(params: RecruitQueryParams): Promise<ApiResponse<RecruitmentByTypeResponse[]>> {
    try {
      // 先获取所有生效中的招聘信息，并关联字典信息
      const sql = `
        SELECT 
          r.id,
          r.recruitment_type,
          r.content,
          r.content_en,
          r.status,
          r.publish_user_id,
          r.publish_times,
          r.create_user_id,
          r.created_times,
          r.update_user_id,
          r.updated_times,
          d.dict_value as type_name,
          d.dict_value_en as type_name_en,
          d.sort_order
        FROM recruit_infos r
        LEFT JOIN sys_dict d ON r.recruitment_type = d.dict_id
        WHERE r.status = '1'
        ORDER BY d.sort_order ASC, r.created_times DESC
      `

      const queryResult = await this.dataSource.query(sql)

      // 按招聘类型分组
      const groupedData: { [key: string]: RecruitmentByTypeResponse } = {}

      queryResult.forEach((item: any) => {
        const recruitItem: RecruitResponse = {
          id: item.id,
          recruitmentType: item.recruitment_type,
          content: item.content,
          contentEn: item.content_en,
          status: item.status,
          publishUserId: item.publish_user_id,
          publishTimes: item.publish_times ? formatDate(item.publish_times) : undefined,
          createUserId: item.create_user_id,
          createdTimes: formatDate(item.created_times),
          updateUserId: item.update_user_id,
          updatedTimes: formatDate(item.updated_times)
        }

        if (!groupedData[item.recruitment_type]) {
          groupedData[item.recruitment_type] = {
            recruitmentType: item.recruitment_type,
            typeName: item.type_name || item.recruitment_type,
            typeNameEn: item.type_name_en,
            items: []
          }
        }

        groupedData[item.recruitment_type].items.push(recruitItem)
      })

      // 转换为数组，保持字典排序
      const result: RecruitmentByTypeResponse[] = Object.values(groupedData)

      return success(result, '获取招聘信息成功')
    } catch (error: any) {
      console.error('获取招聘信息失败:', error)
      return errors.serverError(error.message || '获取招聘信息失败')
    }
  }

  /**
   * 根据招聘类型获取招聘信息
   * @param recruitmentType 招聘类型(字典ID)
   * @returns 指定类型的招聘信息列表
   */
  async getRecruitmentBySpecificType(recruitmentType: string): Promise<ApiResponse<RecruitResponse[]>> {
    try {
      const sql = `
        SELECT 
          r.id,
          r.recruitment_type,
          r.content,
          r.content_en,
          r.status,
          r.publish_user_id,
          r.publish_times,
          r.create_user_id,
          r.created_times,
          r.update_user_id,
          r.updated_times
        FROM recruit_infos r
        WHERE r.recruitment_type = ? AND r.status = '1'
        ORDER BY r.created_times DESC
      `

      const queryResult = await this.dataSource.query(sql, [recruitmentType])

      const list: RecruitResponse[] = queryResult.map((item: any) => ({
        id: item.id,
        recruitmentType: item.recruitment_type,
        content: item.content,
        contentEn: item.content_en,
        status: item.status,
        publishUserId: item.publish_user_id,
        publishTimes: item.publish_times ? formatDate(item.publish_times) : undefined,
        createUserId: item.create_user_id,
        createdTimes: formatDate(item.created_times),
        updateUserId: item.update_user_id,
        updatedTimes: formatDate(item.updated_times)
      }))

      return success(list, `获取${recruitmentType}类型招聘信息成功`)
    } catch (error: any) {
      console.error('获取指定类型招聘信息失败:', error)
      return errors.serverError(error.message || '获取指定类型招聘信息失败')
    }
  }
}
