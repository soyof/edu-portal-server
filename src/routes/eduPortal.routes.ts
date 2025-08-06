import Router from 'koa-router'
import { DefaultState, DefaultContext } from 'koa'
import labProfileController from '../controllers/labProfile.controller'
import toolController from '../controllers/tool.controller'

// 门户网站路由 - 用于公开访问的接口
const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 获取研究所简介信息（公开接口，不需要认证）
router.get('/instituteProfile', labProfileController.getInstituteProfileForPortal)

// 获取实验室环境简介信息（公开接口，不需要认证）
router.get('/labEnvironmentProfile', labProfileController.getLabEnvironmentProfileForPortal)

// 通用获取简介信息接口（根据profileType查询已发布的简介）
router.post('/profile', labProfileController.getProfileByType)

// 获取开源工具列表（公开接口，不需要认证，返回已发布的工具，按发布时间倒序）
router.post('/tools/list', toolController.getToolList)

export default router
