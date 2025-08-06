// 科研工具类型定义

// 科研工具响应数据（门户网站）
export interface ToolResponse {
  id: number; // 主键ID
  title: string; // 工具标题（中文）
  titleEn?: string; // 工具标题（英文）
  description?: string; // 工具描述（中文）
  descriptionEn?: string; // 工具描述（英文）
  toolType: string; // 工具类型
  toolUrl: string; // 工具地址
  publishTimes?: string; // 发布时间
}

// 科研工具查询参数
export interface ToolQueryParams extends PaginationParams {
  title?: string; // 工具标题关键词
  toolType?: string; // 工具类型
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

// 发布状态常量
export const PUBLISH_STATUS = {
  UNPUBLISHED: '0', // 未发布
  PUBLISHED: '1', // 已发布
  OFFLINE: '2' // 已下线
} as const
