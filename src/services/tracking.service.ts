import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import {
  TrackingRequest,
  TrackingResponse,
  RateLimitConfig,
  RateLimitStatus
} from '../types/tracking.types'

export class TrackingService {
  private dataSource: DataSource
  private rateLimitCache: Map<string, RateLimitStatus> = new Map()

  // 限流配置
  private rateLimitConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1分钟窗口
    maxRequests: 100, // 每分钟最多100次请求
    blockDurationMs: 5 * 60 * 1000 // 阻止5分钟
  }

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
    // 定期清理过期的限流记录
    setInterval(() => this.cleanupRateLimit(), 60 * 1000) // 每分钟清理一次
  }

  /**
   * 记录埋点数据
   * @param trackingData 埋点数据
   * @param clientIP 客户端IP
   * @returns 记录结果
   */
  async logEvent(trackingData: TrackingRequest, clientIP: string): Promise<ApiResponse<TrackingResponse>> {
    try {
      // 1. 限流检查
      const rateLimitCheck = this.checkRateLimit(clientIP, trackingData.sessionId)
      if (!rateLimitCheck.allowed) {
        return errors.validationError(`请求过于频繁，请稍后再试。${rateLimitCheck.message}`)
      }

      // 2. 数据验证
      const validation = this.validateTrackingData(trackingData)
      if (!validation.valid) {
        return errors.validationError(validation.message)
      }

      // 3. 数据清洗和转换
      const cleanedData = this.cleanTrackingData(trackingData, clientIP)

      // 4. 写入数据库
      const insertSql = `
        INSERT INTO event_tracking (
          user_id, session_id, event_type, page_path, page_title, referrer,
          user_agent, client_ip, device_type, device_memory, hardware_concurrency,
          browser_name, browser_version, browser_language, os_name, os_version,
          screen_width, screen_height, color_depth, pixel_ratio,
          event_timestamp, event_data, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const insertParams = [
        cleanedData.userId || null,
        cleanedData.sessionId,
        cleanedData.eventType,
        cleanedData.pagePath,
        cleanedData.pageTitle || null,
        cleanedData.referrer || null,
        cleanedData.userAgent || null,
        cleanedData.clientIp,
        cleanedData.deviceType || null,
        cleanedData.deviceMemory || null,
        cleanedData.hardwareConcurrency || null,
        cleanedData.browserName || null,
        cleanedData.browserVersion || null,
        cleanedData.browserLanguage || null,
        cleanedData.osName || null,
        cleanedData.osVersion || null,
        cleanedData.screenWidth || null,
        cleanedData.screenHeight || null,
        cleanedData.colorDepth || null,
        cleanedData.pixelRatio || null,
        cleanedData.eventTimestamp,
        cleanedData.eventData ? JSON.stringify(cleanedData.eventData) : null,
        1 // 状态：有效
      ]

      const result = await this.dataSource.query(insertSql, insertParams)
      const trackingId = result.insertId

      // 5. 更新限流计数
      this.updateRateLimit(clientIP, trackingData.sessionId)

      const response: TrackingResponse = {
        success: true,
        message: '埋点数据记录成功',
        trackingId: trackingId.toString()
      }

      return success(response, '埋点数据记录成功')
    } catch (error: any) {
      console.error('记录埋点数据失败:', error)
      return errors.serverError(error.message || '记录埋点数据失败')
    }
  }

  /**
   * 限流检查
   * @param clientIP 客户端IP
   * @param sessionId 会话ID
   * @returns 检查结果
   */
  private checkRateLimit(clientIP: string, sessionId: string): { allowed: boolean; message: string } {
    const now = Date.now()
    const key = `${clientIP}:${sessionId}`

    const status = this.rateLimitCache.get(key)

    // 检查是否在阻止期内
    if (status?.blocked && status.blockUntil && now < status.blockUntil) {
      const remainingMs = status.blockUntil - now
      const remainingMin = Math.ceil(remainingMs / 60000)
      return {
        allowed: false,
        message: `还需等待 ${remainingMin} 分钟`
      }
    }

    // 检查是否超过限制
    if (status && !status.blocked) {
      if (now < status.resetTime) {
        if (status.count >= this.rateLimitConfig.maxRequests) {
          // 触发阻止
          const blockUntil = now + this.rateLimitConfig.blockDurationMs
          this.rateLimitCache.set(key, {
            ...status,
            blocked: true,
            blockUntil
          })
          return {
            allowed: false,
            message: `1分钟内请求次数过多，已被暂时阻止`
          }
        }
      } else {
        // 时间窗口过期，重置计数
        this.rateLimitCache.set(key, {
          key,
          count: 0,
          resetTime: now + this.rateLimitConfig.windowMs,
          blocked: false
        })
      }
    }

    return { allowed: true, message: '' }
  }

  /**
   * 更新限流计数
   * @param clientIP 客户端IP
   * @param sessionId 会话ID
   */
  private updateRateLimit(clientIP: string, sessionId: string): void {
    const now = Date.now()
    const key = `${clientIP}:${sessionId}`

    const status = this.rateLimitCache.get(key) || {
      key,
      count: 0,
      resetTime: now + this.rateLimitConfig.windowMs,
      blocked: false
    }

    // 如果不在阻止期内，增加计数
    if (!status.blocked || !status.blockUntil || now >= status.blockUntil) {
      status.count++
      status.blocked = false
      delete status.blockUntil
    }

    this.rateLimitCache.set(key, status)
  }

  /**
   * 清理过期的限流记录
   */
  private cleanupRateLimit(): void {
    const now = Date.now()
    const toDelete: string[] = []

    this.rateLimitCache.forEach((status, key) => {
      // 清理已过期的记录
      if (now > status.resetTime && (!status.blockUntil || now > status.blockUntil)) {
        toDelete.push(key)
      }
    })

    toDelete.forEach(key => this.rateLimitCache.delete(key))
  }

  /**
   * 验证埋点数据
   * @param data 埋点数据
   * @returns 验证结果
   */
  private validateTrackingData(data: TrackingRequest): { valid: boolean; message: string } {
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

    if (!data.timestamp || data.timestamp <= 0) {
      return { valid: false, message: 'timestamp 必须是有效的时间戳' }
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

    return { valid: true, message: '' }
  }

  /**
   * 清洗和转换埋点数据
   * @param data 原始数据
   * @param clientIP 客户端IP
   * @returns 清洗后的数据
   */
  private cleanTrackingData(data: TrackingRequest, clientIP: string): any {
    return {
      userId: data.userId?.trim() || null,
      sessionId: data.sessionId.trim(),
      eventType: data.eventType.trim(),
      pagePath: data.pagePath.trim(),
      pageTitle: data.pageTitle?.trim() || null,
      referrer: data.referrer?.trim() || null,
      userAgent: data.userAgent?.trim() || null,
      clientIp: clientIP,
      deviceType: data.deviceInfo?.deviceType || null,
      deviceMemory: data.deviceInfo?.deviceMemory || null,
      hardwareConcurrency: data.deviceInfo?.hardwareConcurrency || null,
      browserName: data.browserInfo?.name || null,
      browserVersion: data.browserInfo?.version || null,
      browserLanguage: data.browserInfo?.language || null,
      osName: data.osInfo?.name || null,
      osVersion: data.osInfo?.version || null,
      screenWidth: data.screenInfo?.width || null,
      screenHeight: data.screenInfo?.height || null,
      colorDepth: data.screenInfo?.colorDepth || null,
      pixelRatio: data.screenInfo?.pixelRatio || null,
      eventTimestamp: data.timestamp,
      eventData: data.eventData || null
    }
  }
}
