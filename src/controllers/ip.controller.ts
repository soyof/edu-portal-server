import { ParameterizedContext as Context } from 'koa'
import { success } from '../utils/response.utils'

export class IpController {
  /**
   * 获取客户端IP地址（门户网站专用，公开接口）
   * @param ctx Koa上下文
   */
  getClientIp = async(ctx: Context): Promise<void> => {
    try {
      // 获取客户端真实IP地址，考虑代理服务器的情况
      const getClientIP = (ctx: Context): string => {
        // 1. 首先检查 X-Forwarded-For 头（适用于反向代理）
        const xForwardedFor = ctx.get('X-Forwarded-For')
        if (xForwardedFor) {
          // X-Forwarded-For 可能包含多个IP，第一个是客户端真实IP
          const ips = xForwardedFor.split(',').map(ip => ip.trim())
          if (ips.length > 0 && ips[0]) {
            return ips[0]
          }
        }

        // 2. 检查 X-Real-IP 头（Nginx等代理服务器使用）
        const xRealIP = ctx.get('X-Real-IP')
        if (xRealIP) {
          return xRealIP
        }

        // 3. 检查 X-Client-IP 头
        const xClientIP = ctx.get('X-Client-IP')
        if (xClientIP) {
          return xClientIP
        }

        // 4. 检查 CF-Connecting-IP 头（Cloudflare使用）
        const cfConnectingIP = ctx.get('CF-Connecting-IP')
        if (cfConnectingIP) {
          return cfConnectingIP
        }

        // 5. 最后使用连接的远程地址
        const remoteAddress = ctx.request.socket.remoteAddress
        if (remoteAddress) {
          // 如果是IPv6格式的IPv4地址，提取IPv4部分
          if (remoteAddress.includes('::ffff:')) {
            return remoteAddress.replace('::ffff:', '')
          }
          return remoteAddress
        }

        // 6. 备用方案
        return ctx.ip || 'unknown'
      }

      const clientIP = getClientIP(ctx)

      // 获取其他相关信息
      const userAgent = ctx.get('User-Agent') || 'unknown'
      const timestamp = new Date().toISOString()

      const result = {
        ip: clientIP,
        userAgent,
        timestamp,
        headers: {
          'X-Forwarded-For': ctx.get('X-Forwarded-For') || null,
          'X-Real-IP': ctx.get('X-Real-IP') || null,
          'X-Client-IP': ctx.get('X-Client-IP') || null,
          'CF-Connecting-IP': ctx.get('CF-Connecting-IP') || null
        }
      }

      ctx.status = 200
      ctx.body = success(result, '获取客户端IP地址成功')
    } catch (error: any) {
      console.error('获取客户端IP地址失败:', error)
      ctx.status = 200
      ctx.body = {
        status: 200,
        errorCode: 500,
        message: error.message || '获取客户端IP地址失败',
        data: null
      }
    }
  }
}

export default new IpController()
