import { ParameterizedContext as Context } from 'koa'
import { TrackingService } from '../services/tracking.service'
import { errors } from '../utils/response.utils'
import { TrackingRequest } from '../types/tracking.types'

export class TrackingController {
  /**
   * 记录埋点数据（门户网站专用，公开接口）
   * @param ctx Koa上下文
   */
  logEvent = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as TrackingRequest

      // 获取客户端真实IP地址
      const getClientIP = (ctx: Context): string => {
        // 优先检查各种代理头
        const xForwardedFor = ctx.get('X-Forwarded-For')
        if (xForwardedFor) {
          const ips = xForwardedFor.split(',').map(ip => ip.trim())
          if (ips.length > 0 && ips[0]) {
            return ips[0]
          }
        }

        const xRealIP = ctx.get('X-Real-IP')
        if (xRealIP) return xRealIP

        const xClientIP = ctx.get('X-Client-IP')
        if (xClientIP) return xClientIP

        const cfConnectingIP = ctx.get('CF-Connecting-IP')
        if (cfConnectingIP) return cfConnectingIP

        const remoteAddress = ctx.request.socket.remoteAddress
        if (remoteAddress) {
          if (remoteAddress.includes('::ffff:')) {
            return remoteAddress.replace('::ffff:', '')
          }
          return remoteAddress
        }

        return ctx.ip || 'unknown'
      }

      const clientIP = getClientIP(ctx)

      // 基础数据验证
      if (!body || typeof body !== 'object') {
        ctx.status = 200
        ctx.body = errors.validationError('请求体必须是有效的JSON对象')
        return
      }

      // 构建埋点数据（clientIp由服务端强制获取，不使用前端传入的值）
      const { clientIp: _, ...frontendData } = body // 故意丢弃前端传入的clientIp
      const trackingData: TrackingRequest = {
        ...frontendData,
        clientIp: clientIP, // 强制使用服务端获取的IP
        userAgent: ctx.get('User-Agent') || body.userAgent // 优先使用请求头中的User-Agent
      }

      // 安全性检查：防止XSS和注入攻击
      const securityCheck = this.performSecurityCheck(trackingData)
      if (!securityCheck.safe) {
        ctx.status = 200
        ctx.body = errors.validationError(`安全检查失败: ${securityCheck.message}`)
        return
      }

      // 调用服务层记录数据
      const trackingService = new TrackingService(ctx.db)
      const result = await trackingService.logEvent(trackingData, clientIP)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('记录埋点数据失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '记录埋点数据失败')
    }
  }

  /**
   * 安全性检查
   * @param data 埋点数据
   * @returns 检查结果
   */
  private performSecurityCheck(data: TrackingRequest): { safe: boolean; message: string } {
    // 检查SQL注入风险
    const sqlInjectionPatterns = [
      /('|(\\)|;|--|\bor\b|\band\b|\bunion\b|\bselect\b|\binsert\b|\bdelete\b|\bupdate\b|\bdrop\b)/i
    ]

    const textFields = [
      data.pagePath,
      data.pageTitle,
      data.referrer,
      data.sessionId,
      data.userId
    ]

    for (const field of textFields) {
      if (field && typeof field === 'string') {
        for (const pattern of sqlInjectionPatterns) {
          if (pattern.test(field)) {
            return { safe: false, message: '检测到潜在的SQL注入攻击' }
          }
        }
      }
    }

    // 检查XSS风险
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/i,
      /on\w+\s*=/i
    ]

    for (const field of textFields) {
      if (field && typeof field === 'string') {
        for (const pattern of xssPatterns) {
          if (pattern.test(field)) {
            return { safe: false, message: '检测到潜在的XSS攻击' }
          }
        }
      }
    }

    // 检查eventData中的安全风险
    if (data.eventData && typeof data.eventData === 'object') {
      const eventDataStr = JSON.stringify(data.eventData)
      for (const pattern of [...sqlInjectionPatterns, ...xssPatterns]) {
        if (pattern.test(eventDataStr)) {
          return { safe: false, message: '事件数据中检测到安全风险' }
        }
      }

      // 检查eventData大小（防止过大的数据）
      if (eventDataStr.length > 10240) { // 10KB限制
        return { safe: false, message: '事件数据过大，超过10KB限制' }
      }
    }

    // 检查字段长度限制
    const lengthChecks = [
      { field: data.pagePath, name: 'pagePath', maxLength: 255 },
      { field: data.pageTitle, name: 'pageTitle', maxLength: 255 },
      { field: data.referrer, name: 'referrer', maxLength: 500 },
      { field: data.sessionId, name: 'sessionId', maxLength: 64 },
      { field: data.userId, name: 'userId', maxLength: 64 }
    ]

    for (const check of lengthChecks) {
      if (check.field && check.field.length > check.maxLength) {
        return { safe: false, message: `${check.name} 长度超过限制 (${check.maxLength})` }
      }
    }

    // 检查时间戳合理性（不能是未来时间，不能太久远）
    const now = Date.now()
    const oneYearMs = 365 * 24 * 60 * 60 * 1000

    if (data.timestamp > now + 60000) { // 允许1分钟的时钟偏差
      return { safe: false, message: '时间戳不能是未来时间' }
    }

    if (data.timestamp < now - oneYearMs) {
      return { safe: false, message: '时间戳过于久远' }
    }

    return { safe: true, message: '' }
  }

  /**
   * 获取埋点统计信息（可选的管理接口）
   * @param ctx Koa上下文
   */
  getTrackingStats = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 基础统计查询
      const statsSql = `
        SELECT 
          DATE(FROM_UNIXTIME(event_timestamp/1000)) as date,
          event_type,
          COUNT(*) as count
        FROM event_tracking 
        WHERE created_times >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND status = 1
        GROUP BY DATE(FROM_UNIXTIME(event_timestamp/1000)), event_type
        ORDER BY date DESC, count DESC
      `

      const statsResult = await ctx.db.query(statsSql)

      ctx.status = 200
      ctx.body = {
        status: 200,
        errorCode: 0,
        message: '获取统计信息成功',
        data: {
          stats: statsResult,
          period: '最近7天'
        }
      }
    } catch (error: any) {
      console.error('获取埋点统计信息失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取埋点统计信息失败')
    }
  }
}

export default new TrackingController()
