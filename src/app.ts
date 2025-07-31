import dotenv from 'dotenv'
import path from 'path'

// 使用绝对路径加载.env文件
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import serve from 'koa-static'
import 'reflect-metadata'

import { databaseMiddleware } from './middlewares/database.middleware'
import { responseMiddleware } from './middlewares/response.middleware'
import { closeConnection } from './config/database'
import indexRoutes, { registerAPIRoutes } from './routes/index.routes'

// 创建Koa应用实例
const app = new Koa()
const PORT = process.env.PORT

// 基础中间件
app.use(logger())
app.use(bodyParser())

// 静态文件服务
app.use(serve(path.join(process.cwd(), 'data')))

// 全局响应处理中间件（应当在最前面注册，以捕获后续中间件的错误）
app.use(responseMiddleware)

// 注册不需要数据库连接的基础路由
app.use(indexRoutes.routes()).use(indexRoutes.allowedMethods())

// 添加数据库中间件 - 为需要数据库的请求创建数据库连接
app.use(databaseMiddleware)

// 注册需要数据库连接的API路由
registerAPIRoutes(app)

// 处理404错误
app.use(async(ctx) => {
  ctx.status = 404
  ctx.body = {
    status: 404,
    message: '请求的资源不存在'
  }
})

// 错误事件监听
app.on('error', (err, ctx) => {
  console.error('服务器错误:', err, ctx)
})

// 处理应用程序退出
process.on('SIGINT', async() => {
  console.log('接收到中断信号，正在关闭应用...')
  await closeConnection()
  process.exit(0)
})

process.on('SIGTERM', async() => {
  console.log('接收到终止信号，正在关闭应用...')
  await closeConnection()
  process.exit(0)
})

process.on('uncaughtException', async(error) => {
  console.error('未捕获的异常:', error)
  await closeConnection()
  process.exit(1)
})

process.on('unhandledRejection', async(reason, promise) => {
  console.error('未处理的Promise拒绝:', reason)
  await closeConnection()
  process.exit(1)
})

// 启动服务器
const startServer = async() => {
  try {
    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('服务器启动失败:', error)
    await closeConnection()
    process.exit(1)
  }
}

// 启动应用
startServer()
