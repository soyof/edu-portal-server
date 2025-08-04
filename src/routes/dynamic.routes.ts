import Router from 'koa-router'
import dynamicController from '../controllers/dynamic.controller'
import { DefaultState, DefaultContext } from 'koa'

const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 分页获取所有动态列表（支持类型筛选）
router.post('/dynamic/list', dynamicController.getDynamicList)

// 获取动态详情
router.get('/dynamic/:id', dynamicController.getDynamicDetail)

export default router
