import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import {
  SimpleLogRequest,
  SimpleLogResponse,
  SimpleLogData
} from '../types/simpleLog.types'

export class SimpleLogService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 记录简化的埋点数据（只保存指定的核心字段，每用户每天仅记录一次）
   * @param logData 简化的日志数据
   * @param clientIP 客户端IP
   * @returns 记录结果
   */
  async logSimpleEvent(logData: SimpleLogRequest, clientIP: string): Promise<ApiResponse<SimpleLogResponse>> {
    try {
      // 1. 数据验证
      const validation = this.validateSimpleLogData(logData)
      if (!validation.valid) {
        return errors.validationError(validation.message)
      }

      // 2. 检查用户今日是否已记录（防重复）
      const duplicateCheck = await this.checkDuplicateToday(logData.userId, logData.sessionId, clientIP)
      if (duplicateCheck.isDuplicate) {
        // 重复访问，返回成功但不存储
        const response: SimpleLogResponse = {
          success: true,
          message: '访问记录成功（今日已记录）',
          logId: duplicateCheck.existingLogId
        }
        return success(response, '访问记录成功（今日已记录）')
      }

      // 3. 数据清洗和转换
      const cleanedData = this.cleanSimpleLogData(logData, clientIP)

      // 4. 写入数据库（复用event_tracking表，只填充指定字段）
      const insertSql = `
        INSERT INTO event_tracking (
          user_id, session_id, event_type, page_path, page_title,
          client_ip, browser_name, browser_version, browser_language,
          os_name, os_version, event_timestamp, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const insertParams = [
        cleanedData.userId,
        cleanedData.sessionId,
        cleanedData.eventType,
        cleanedData.pagePath,
        cleanedData.pageTitle,
        cleanedData.clientIp,
        cleanedData.browserName,
        cleanedData.browserVersion,
        cleanedData.browserLanguage,
        cleanedData.osName,
        cleanedData.osVersion,
        Date.now(), // 当前时间戳作为事件时间
        1 // 状态：有效
      ]

      const result = await this.dataSource.query(insertSql, insertParams)
      const logId = result.insertId

      const response: SimpleLogResponse = {
        success: true,
        message: '简化埋点数据记录成功',
        logId: logId.toString()
      }

      return success(response, '简化埋点数据记录成功')
    } catch (error: any) {
      console.error('记录简化埋点数据失败:', error)
      return errors.serverError(error.message || '记录简化埋点数据失败')
    }
  }

  /**
   * 验证简化埋点数据
   * @param data 简化埋点数据
   * @returns 验证结果
   */
  private validateSimpleLogData(data: SimpleLogRequest): { valid: boolean; message: string } {
    // 必填字段检查
    if (!data.sessionId || data.sessionId.trim().length === 0) {
      return { valid: false, message: 'sessionId 不能为空' }
    }

    if (!data.pagePath || data.pagePath.trim().length === 0) {
      return { valid: false, message: 'pagePath 不能为空' }
    }

    if (!data.eventType || data.eventType.trim().length === 0) {
      return { valid: false, message: 'eventType 不能为空' }
    }

    // 长度限制检查
    if (data.sessionId.length > 64) {
      return { valid: false, message: 'sessionId 长度不能超过64个字符' }
    }

    if (data.pagePath.length > 255) {
      return { valid: false, message: 'pagePath 长度不能超过255个字符' }
    }

    if (data.pageTitle && data.pageTitle.length > 255) {
      return { valid: false, message: 'pageTitle 长度不能超过255个字符' }
    }

    if (data.userId && data.userId.length > 64) {
      return { valid: false, message: 'userId 长度不能超过64个字符' }
    }

    if (data.eventType.length > 20) {
      return { valid: false, message: 'eventType 长度不能超过20个字符' }
    }

    return { valid: true, message: '' }
  }

  /**
   * 清洗和转换简化埋点数据
   * @param data 原始数据
   * @param clientIP 客户端IP
   * @returns 清洗后的数据
   */
  private cleanSimpleLogData(data: SimpleLogRequest, clientIP: string): SimpleLogData {
    return {
      userId: data.userId?.trim() || null,
      sessionId: data.sessionId.trim(),
      eventType: data.eventType.trim(),
      pagePath: data.pagePath.trim(),
      pageTitle: data.pageTitle?.trim() || null,
      clientIp: clientIP,
      browserName: data.browserInfo?.name?.trim() || null,
      browserVersion: data.browserInfo?.version?.trim() || null,
      browserLanguage: data.browserInfo?.language?.trim() || null,
      osName: data.osInfo?.name?.trim() || null,
      osVersion: data.osInfo?.version?.trim() || null
    }
  }

  /**
   * 检查用户今日是否已有记录（防重复）
   * @param userId 用户ID
   * @param sessionId 会话ID
   * @param clientIP 客户端IP
   * @returns 检查结果
   */
  private async checkDuplicateToday(userId: string | undefined, sessionId: string, clientIP: string): Promise<{ isDuplicate: boolean; existingLogId?: string }> {
    try {
      // 构建查询条件：优先按用户ID查询，如果没有用户ID则按IP查询
      let sql: string
      let params: any[]

      if (userId && userId.trim()) {
        // 有用户ID的情况：按用户ID + 今日时间查询
        sql = `
          SELECT id FROM event_tracking 
          WHERE user_id = ? 
          AND DATE(created_times) = CURDATE() 
          AND status = 1 
          LIMIT 1
        `
        params = [userId.trim()]
      } else {
        // 匿名用户：按IP + 会话ID + 今日时间查询
        sql = `
          SELECT id FROM event_tracking 
          WHERE client_ip = ? 
          AND session_id = ?
          AND DATE(created_times) = CURDATE() 
          AND status = 1 
          LIMIT 1
        `
        params = [clientIP, sessionId]
      }

      const result = await this.dataSource.query(sql, params)

      if (result && result.length > 0) {
        return {
          isDuplicate: true,
          existingLogId: result[0].id.toString()
        }
      }

      return { isDuplicate: false }
    } catch (error: any) {
      console.error('检查重复记录失败:', error)
      // 如果检查失败，为了不影响正常流程，返回非重复
      return { isDuplicate: false }
    }
  }
}
