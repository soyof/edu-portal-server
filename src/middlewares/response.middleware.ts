import { Context, Next } from 'koa'
import { errors } from '../utils/response.utils'

/**
 * 全局响应处理中间件
 * 处理未捕获的错误，将其转换为统一的响应格式
 */
export const responseMiddleware = async(ctx: Context, next: Next): Promise<void> => {
  try {
    // 继续执行下一个中间件
    await next()

    // 对404错误进行处理
    if (ctx.status === 404 && !ctx.body) {
      ctx.status = 200
      ctx.body = errors.notFound('请求的资源不存在')
    }
  } catch (error: any) {
    // 记录错误
    console.error('全局错误处理:', error)

    // 设置状态码并使用统一的错误响应格式
    ctx.status = 200

    if (error.status === 401) {
      ctx.body = errors.unauthorized(error.message || '未授权访问')
    } else if (error.status === 403) {
      ctx.body = errors.forbidden(error.message || '禁止访问')
    } else if (error.status === 404) {
      ctx.body = errors.notFound(error.message || '资源不存在')
    } else if (error.status === 422) {
      ctx.body = errors.validationError(error.message || '数据验证错误')
    } else {
      // 默认为服务器错误
      ctx.body = errors.serverError(
        process.env.NODE_ENV === 'development'
          ? error.message || '服务器内部错误'
          : '服务器内部错误'
      )
    }

    // 向应用程序发出错误事件
    ctx.app.emit('error', error, ctx)
  }
}
