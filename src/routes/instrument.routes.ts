import Router from 'koa-router'
import instrumentController from '../controllers/instrument.controller'
import { DefaultState, DefaultContext } from 'koa'

const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 分页获取仪器列表
router.post('/instruments/list', instrumentController.getInstrumentList)

// 获取仪器详情
router.get('/instruments/:id', instrumentController.getInstrumentDetail)

export default router
