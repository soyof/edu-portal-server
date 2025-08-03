import Router from 'koa-router'
import { DefaultState, DefaultContext } from 'koa'
import researchController from '../controllers/research.controller'

const router = new Router<DefaultState, DefaultContext>({ prefix: '/eduPortal' })

// 获取科研成果概览（论文、专利、著作各前5条）
router.get('/research/achievements', researchController.getResearchOverview)

// 分页获取论文列表
router.post('/research/papersList', researchController.getPaperList)

// 分页获取专利列表
router.post('/research/patentsList', researchController.getPatentList)

// 分页获取著作列表
router.post('/research/booksList', researchController.getBookList)

// 获取论文详情
router.get('/research/papers/:id', researchController.getPaperDetail)

// 获取专利详情
router.get('/research/patents/:id', researchController.getPatentDetail)

// 获取著作详情
router.get('/research/books/:id', researchController.getBookDetail)

export default router
