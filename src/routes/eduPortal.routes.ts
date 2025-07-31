import Router from 'koa-router'
import { DefaultState, DefaultContext } from 'koa'
import labProfileController from '../controllers/labProfile.controller'

// 门户网站路由 - 用于公开访问的接口
const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 获取研究所简介信息（公开接口，不需要认证）
router.get('/instituteProfile', labProfileController.getInstituteProfileForPortal)

export default router
