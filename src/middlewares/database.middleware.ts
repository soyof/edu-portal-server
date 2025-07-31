import { Context, Next } from 'koa'
import { DataSource } from 'typeorm'
import { getConnection } from '../config/database'

// 扩展Koa的Context类型，添加db属性
declare module 'koa' {
  interface DefaultContext {
    db?: DataSource;
  }
}

/**
 * 数据库连接中间件
 * 在请求处理过程中提供数据库连接
 * 使用连接池管理连接，不再每次请求结束后关闭连接
 */
export const databaseMiddleware = async(ctx: Context, next: Next): Promise<void> => {
  // 如果是对根路径的访问，不需要数据库连接
  if (ctx.path === '/') {
    return await next()
  }

  // 如果是对静态资源或不需要数据库的路由的访问，不创建连接
  if (ctx.path.startsWith('/public') || ctx.path === '/health' || ctx.path === '/favicon.ico') {
    return await next()
  }

  try {
    console.log(`[数据库] 正在为请求 ${ctx.method} ${ctx.url} 获取数据库连接...`)

    // 从连接池获取连接
    const dataSource = await getConnection()

    // 将数据库连接保存到上下文中，以便后续中间件和控制器使用
    ctx.db = dataSource

    console.log(`[数据库] 连接获取成功，继续处理请求...`)

    // 继续处理请求
    await next()
  } catch (error: any) {
    console.error('[数据库] 连接错误:', error.message)

    // 仅在开发环境打印详细错误
    if (process.env.NODE_ENV === 'development') {
      console.error('[数据库] 错误详情:', error)
    }

    ctx.status = 500
    ctx.body = {
      status: 500,
      message: '数据库连接错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }
  }
}
