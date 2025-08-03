import Router from 'koa-router'
import { DefaultState, DefaultContext } from 'koa'
import recruitController from '../controllers/recruit.controller'

const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 获取所有招聘信息（按类型分组） - 必须放在动态路由之前
router.get('/recruitment', recruitController.getRecruitmentByType)

// 根据招聘类型获取招聘信息
router.get('/recruitment/:recruitmentType', recruitController.getRecruitmentBySpecificType)

export default router
