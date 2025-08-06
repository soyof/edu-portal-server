import { ParameterizedContext as Context } from 'koa'
import { SimpleLogService } from '../services/simpleLog.service'
import { errors } from '../utils/response.utils'
import { SimpleLogRequest } from '../types/simpleLog.types'

export class SimpleLogController {
  /**
   * 记录简化埋点数据（门户网站专用，公开接口，每用户每天仅记录一次）
   * @param ctx Koa上下文
   */
  logSimpleEvent = async(ctx: Context): Promise<void> => {
    try {
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      const body = ctx.request.body as SimpleLogRequest

      // 获取客户端真实IP地址（复用tracking.controller.ts的逻辑）
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

      // 基础安全检查（简化版，只检查核心字段）
      const securityCheck = this.performBasicSecurityCheck(body)
      if (!securityCheck.safe) {
        ctx.status = 200
        ctx.body = errors.validationError(`安全检查失败: ${securityCheck.message}`)
        return
      }

      // 调用服务层记录数据
      const simpleLogService = new SimpleLogService(ctx.db)
      const result = await simpleLogService.logSimpleEvent(body, clientIP)

      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('记录简化埋点数据失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '记录简化埋点数据失败')
    }
  }

  /**
   * 基础安全检查（简化版）
   * @param data 简化埋点数据
   * @returns 检查结果
   */
  private performBasicSecurityCheck(data: SimpleLogRequest): { safe: boolean; message: string } {
    // 检查SQL注入风险
    const sqlInjectionPatterns = [
      /('|(\\)|;|--|\bor\b|\band\b|\bunion\b|\bselect\b|\binsert\b|\bdelete\b|\bupdate\b|\bdrop\b)/i
    ]

    const textFields = [
      data.pagePath,
      data.pageTitle,
      data.sessionId,
      data.userId,
      data.eventType
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

    // 检查字段长度限制
    const lengthChecks = [
      { field: data.pagePath, name: 'pagePath', maxLength: 255 },
      { field: data.pageTitle, name: 'pageTitle', maxLength: 255 },
      { field: data.sessionId, name: 'sessionId', maxLength: 64 },
      { field: data.userId, name: 'userId', maxLength: 64 },
      { field: data.eventType, name: 'eventType', maxLength: 20 }
    ]

    for (const check of lengthChecks) {
      if (check.field && check.field.length > check.maxLength) {
        return { safe: false, message: `${check.name} 长度超过限制 (${check.maxLength})` }
      }
    }

    return { safe: true, message: '' }
  }
}

export default new SimpleLogController()
