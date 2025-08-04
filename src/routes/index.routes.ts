import Router from 'koa-router'
import Koa from 'koa'
import { DefaultState, DefaultContext } from 'koa'
import eduPortalRoutes from './eduPortal.routes'
import userRoutes from './user.routes'
import dictRoutes from './dict.routes'
import recruitRoutes from './recruit.routes'
import researchRoutes from './research.routes'
import dynamicRoutes from './dynamic.routes'
import instrumentRoutes from './instrument.routes'
import noticeRoutes from './notice.routes'
import toolRoutes from './tool.routes'

// 使用与子路由一致的类型定义
const router = new Router<DefaultState, DefaultContext>()

// 根路由处理程序 - 这些不需要数据库连接
router.get('/', async(ctx) => {
  ctx.body = {
    status: 200,
    message: '欢迎使用教育系统API服务',
    version: '1.0.0'
  }
})

// 健康检查路由 - 不需要数据库连接
router.get('/health', async(ctx) => {
  ctx.body = {
    status: 'UP',
    timestamp: new Date().toISOString()
  }
})

export default router

// 导出需要数据库连接的API路由集合函数
export const registerAPIRoutes = (app: Koa) => {
  // 注册门户网站路由
  app.use(eduPortalRoutes.routes()).use(eduPortalRoutes.allowedMethods())

  // 注册用户信息路由
  app.use(userRoutes.routes()).use(userRoutes.allowedMethods())

  // 注册字典信息路由
  app.use(dictRoutes.routes()).use(dictRoutes.allowedMethods())

  // 注册招聘信息路由
  app.use(recruitRoutes.routes()).use(recruitRoutes.allowedMethods())

  // 注册科研成果路由
  app.use(researchRoutes.routes()).use(researchRoutes.allowedMethods())

  // 注册动态信息路由
  app.use(dynamicRoutes.routes()).use(dynamicRoutes.allowedMethods())

  // 注册仪器信息路由
  app.use(instrumentRoutes.routes()).use(instrumentRoutes.allowedMethods())

  // 注册通知信息路由
  app.use(noticeRoutes.routes()).use(noticeRoutes.allowedMethods())

  // 注册科研工具路由
  app.use(toolRoutes.routes()).use(toolRoutes.allowedMethods())

  return app
}
