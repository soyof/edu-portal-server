import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import { UserQueryParams, UserInfoResponse, UserDetailResponse } from '../types/user.types'
import { formatDate } from '../utils/utils'

// 用户服务类
export class UserService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 根据用户ID获取用户基本信息
   * @param userId 用户ID
   * @returns 用户基本信息
   */
  async getUserInfo(userId: string): Promise<ApiResponse<UserInfoResponse>> {
    try {
      // 构建SQL查询
      const sql = `
        SELECT 
          u.user_id,
          u.username,
          u.email,
          u.phone,
          u.title,
          u.tags,
          u.avatar,
          u.id_pic,
          u.lab_homepage,
          u.personal_homepage,
          u.role,
          u.status,
          u.created_times,
          u.updated_times
        FROM user_infos u
        WHERE u.user_id = ? AND u.status = 1
      `

      const queryResult = await this.dataSource.query(sql, [userId])

      if (!queryResult || queryResult.length === 0) {
        return errors.notFound('用户不存在')
      }

      const user = queryResult[0]

      // 处理标签字段，如果是JSON字符串则解析，否则返回空数组
      let tags: string[] = []
      if (user.tags) {
        try {
          tags = JSON.parse(user.tags)
        } catch {
          // 如果解析失败，尝试按逗号分割
          tags = user.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        }
      }

      const userInfo: UserInfoResponse = {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        title: user.title,
        tags: tags,
        avatar: user.avatar,
        idPic: user.id_pic,
        labHomepage: user.lab_homepage,
        personalHomepage: user.personal_homepage,
        createdTimes: formatDate(user.created_times),
        updatedTimes: formatDate(user.updated_times)
      }

      return success(userInfo, '获取用户信息成功')
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      return errors.serverError(error.message || '获取用户信息失败')
    }
  }

  /**
   * 查询用户列表（全部）
   * @param params 查询参数
   * @returns 用户列表
   */
  async getUserList(params: UserQueryParams): Promise<ApiResponse<UserInfoResponse[]>> {
    try {
      // 查询所有用户数据
      const listSql = `
        SELECT 
          u.user_id,
          u.username,
          u.email,
          u.phone,
          u.title,
          u.tags,
          u.avatar,
          u.id_pic,
          u.lab_homepage,
          u.personal_homepage,
          u.created_times,
          u.updated_times
        FROM user_infos u
        WHERE u.status = 1
        ORDER BY u.created_times DESC
      `

      const listResult = await this.dataSource.query(listSql)

      // 处理返回数据
      const list: UserInfoResponse[] = listResult.map((user: any) => {
        // 处理标签字段
        let tags: string[] = []
        if (user.tags) {
          try {
            tags = JSON.parse(user.tags)
          } catch {
            tags = user.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
          }
        }

        return {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          title: user.title,
          tags: tags,
          avatar: user.avatar,
          idPic: user.id_pic,
          labHomepage: user.lab_homepage,
          personalHomepage: user.personal_homepage,
          createdTimes: formatDate(user.created_times),
          updatedTimes: formatDate(user.updated_times)
        }
      })

      return success(list, '获取用户列表成功')
    } catch (error: any) {
      console.error('获取用户列表失败:', error)
      return errors.serverError(error.message || '获取用户列表失败')
    }
  }

  /**
   * 根据用户ID获取用户完整详细信息
   * @param userId 用户ID
   * @returns 用户完整详细信息
   */
  async getUserDetail(userId: string): Promise<ApiResponse<UserDetailResponse>> {
    try {
      // 构建SQL查询，联查用户基础信息和扩展信息
      const sql = `
        SELECT 
          u.user_id,
          u.username,
          u.password,
          u.phone,
          u.email,
          u.lab_homepage,
          u.personal_homepage,
          u.tags,
          u.avatar,
          u.id_pic,
          u.title,
          u.created_times,
          u.updated_times,
          uo.bio,
          uo.bio_en,
          uo.research_direction,
          uo.research_direction_en,
          uo.research_project,
          uo.research_project_en,
          uo.academic_appointment,
          uo.academic_appointment_en,
          uo.awards,
          uo.awards_en,
          uo.academic_research,
          uo.academic_research_en,
          uo.publications,
          uo.publications_en
        FROM user_infos u
        LEFT JOIN user_other_infos uo ON u.user_id = uo.user_id
        WHERE u.user_id = ? AND u.status = 1
      `

      const queryResult = await this.dataSource.query(sql, [userId])

      if (!queryResult || queryResult.length === 0) {
        return errors.notFound('用户不存在')
      }

      const user = queryResult[0]

      // 处理标签字段，如果是JSON字符串则解析，否则返回空数组
      let tags: string[] = []
      if (user.tags) {
        try {
          tags = JSON.parse(user.tags)
        } catch {
          // 如果解析失败，尝试按逗号分割
          tags = user.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        }
      }

      const userDetail: UserDetailResponse = {
        userId: user.user_id,
        username: user.username,
        password: user.password,
        phone: user.phone,
        email: user.email,
        labHomepage: user.lab_homepage,
        personalHomepage: user.personal_homepage,
        tags: tags,
        avatar: user.avatar,
        idPic: user.id_pic,
        title: user.title,
        bio: user.bio,
        bioEn: user.bio_en,
        researchDirection: user.research_direction,
        researchDirectionEn: user.research_direction_en,
        researchProject: user.research_project,
        researchProjectEn: user.research_project_en,
        academicAppointment: user.academic_appointment,
        academicAppointmentEn: user.academic_appointment_en,
        awards: user.awards,
        awardsEn: user.awards_en,
        academicResearch: user.academic_research,
        academicResearchEn: user.academic_research_en,
        publications: user.publications,
        publicationsEn: user.publications_en,
        createdTimes: formatDate(user.created_times),
        updatedTimes: formatDate(user.updated_times)
      }

      return success(userDetail, '获取用户详细信息成功')
    } catch (error: any) {
      console.error('获取用户详细信息失败:', error)
      return errors.serverError(error.message || '获取用户详细信息失败')
    }
  }
}
