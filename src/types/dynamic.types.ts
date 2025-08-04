// 科研动态类型定义

// 动态响应数据（门户网站）
export interface DynamicResponse {
  id: number; // 主键ID
  title: string; // 中文标题
  titleEn?: string; // 英文标题
  dynamicType: string; // 动态类型: 6001(科研动态), 6002(新闻动态)
  content?: string; // 中文内容
  contentEn?: string; // 英文内容
  publishTimes?: string; // 发布时间
}

// 动态查询参数
export interface DynamicQueryParams extends PaginationParams {
  title?: string; // 标题关键词
  dynamicType?: string; // 动态类型: 6001(科研动态), 6002(新闻动态)
  publishYear?: number; // 发布年份
  publishMonth?: number; // 发布月份（1-12）
}

// 分页查询参数
export interface PaginationParams {
  pageNo?: number; // 页码，默认1
  pageSize?: number; // 每页数量，默认10
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]; // 记录列表
  total: number; // 总记录数
  pageNo: number; // 当前页码
  pageSize: number; // 每页数量
  totalPages: number; // 总页数
}

// 动态类型常量
export const DYNAMIC_TYPES = {
  RESEARCH: '6001', // 科研动态
  NEWS: '6002' // 新闻动态
} as const

// 发布状态常量
export const PUBLISH_STATUS = {
  UNPUBLISHED: '0', // 未发布
  PUBLISHED: '1', // 已发布
  OFFLINE: '2' // 已下线
} as const

