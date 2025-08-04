import Router from 'koa-router'
import toolController from '../controllers/tool.controller'
import { DefaultState, DefaultContext } from 'koa'

const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 分页获取科研工具列表
router.post('/tools/list', toolController.getToolList)

export default router
