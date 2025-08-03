import Router from 'koa-router'
import { DefaultState, DefaultContext } from 'koa'
import userController from '../controllers/user.controller'

const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 获取用户列表（分页） - 必须放在动态路由之前
router.get('/getUserList', userController.getUserList)

// 获取用户完整详细信息 - 必须放在通用动态路由之前
router.get('/getUserDetail/:userId', userController.getUserDetail)

export default router
