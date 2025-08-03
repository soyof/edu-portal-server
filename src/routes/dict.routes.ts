import Router from 'koa-router'
import { DefaultState, DefaultContext } from 'koa'
import dictController from '../controllers/dict.controller'

const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 根据字典类型获取字典列表
router.get('/dict/:dictType', dictController.getDictByType)

export default router
