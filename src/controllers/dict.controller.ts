import { ParameterizedContext as Context } from 'koa'
import { DictService } from '../services/dict.service'
import { errors } from '../utils/response.utils'
import { DictQueryParams } from '../types/dict.types'

export class DictController {
  // 根据字典类型获取字典列表
  getDictByType = async(ctx: Context): Promise<void> => {
    try {
      // 从上下文中获取数据库连接
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 获取字典类型参数
      const dictType = ctx.params.dictType || ctx.query.dictType as string
      if (!dictType) {
        ctx.status = 200
        ctx.body = errors.validationError('字典类型不能为空')
        return
      }

      // 创建服务实例
      const dictService = new DictService(ctx.db)

      // 查询字典数据
      const params: DictQueryParams = { dictType: dictType }
      const result = await dictService.getDictByType(params)

      // 直接返回服务层的结果
      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取字典数据失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取字典数据失败')
    }
  }

  // 获取所有字典类型列表
  getDictTypes = async(ctx: Context): Promise<void> => {
    try {
      // 从上下文中获取数据库连接
      if (!ctx.db) {
        throw new Error('数据库连接不可用')
      }

      // 创建服务实例
      const dictService = new DictService(ctx.db)

      // 查询字典类型列表
      const result = await dictService.getDictTypes()

      // 直接返回服务层的结果
      ctx.status = result.status
      ctx.body = result
    } catch (error: any) {
      console.error('获取字典类型列表失败:', error)
      ctx.status = 200
      ctx.body = errors.serverError(error.message || '获取字典类型列表失败')
    }
  }
}

export default new DictController()
