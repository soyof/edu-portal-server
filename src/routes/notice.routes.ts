import Router from 'koa-router'
import noticeController from '../controllers/notice.controller'
import { DefaultState, DefaultContext } from 'koa'

const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 分页获取通知列表
router.post('/notices/list', noticeController.getNoticeList)

// 获取通知详情（仅支持类型2002的文本通知）
router.get('/notices/:id', noticeController.getNoticeDetail)

export default router
