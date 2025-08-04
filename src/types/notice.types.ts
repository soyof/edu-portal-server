// 通知类型定义

// 通知响应数据（门户网站列表）
export interface NoticeListResponse {
  id: number; // 通知ID
  title: string; // 通知标题
  titleEn?: string; // 通知标题（英文）
  noticeType: string; // 通知类型: 2001(超链接), 2002(文本)
  importance: string; // 重要程度: 3001(普通), 3002(重要), 3003(紧急)
  linkUrl?: string; // 超链接地址（仅类型为2001时有值）
  publishTimes?: string; // 发布时间
}

// 通知详情响应数据（门户网站详情，仅支持类型2002）
export interface NoticeDetailResponse {
  id: number; // 通知ID
  title: string; // 通知标题
  titleEn?: string; // 通知标题（英文）
  noticeType: string; // 通知类型（固定为2002）
  importance: string; // 重要程度: 3001(普通), 3002(重要), 3003(紧急)
  content?: string; // 通知内容（中文）
  contentEn?: string; // 通知内容（英文）
  publishTimes?: string; // 发布时间
}

// 通知查询参数
export interface NoticeQueryParams extends PaginationParams {
  title?: string; // 标题关键词
  noticeType?: string; // 通知类型: 2001(超链接), 2002(文本)
  importance?: string; // 重要程度: 3001(普通), 3002(重要), 3003(紧急)
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

// 通知类型常量
export const NOTICE_TYPES = {
  LINK: '2001', // 超链接
  TEXT: '2002' // 文本
} as const

// 重要程度常量
export const IMPORTANCE_LEVELS = {
  NORMAL: '3001', // 普通
  IMPORTANT: '3002', // 重要
  URGENT: '3003' // 紧急
} as const

// 发布状态常量
export const PUBLISH_STATUS = {
  UNPUBLISHED: '0', // 未发布
  PUBLISHED: '1', // 已发布
  OFFLINE: '2' // 已下线
} as const
