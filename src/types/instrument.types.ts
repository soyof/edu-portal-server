// 实验室仪器类型定义

// 仪器响应数据（门户网站列表）
export interface InstrumentListResponse {
  id: number; // 主键ID
  instName: string; // 仪器名称（中文）
  instNameEn?: string; // 仪器名称（英文）
  manufacturer: string; // 生产厂家（中文）
  manufacturerEn?: string; // 生产厂家（英文）
  model: string; // 型号
  imageFiles?: string[]; // 仪器图片（存储文件名数组）
  publishTimes?: string; // 发布时间
}

// 仪器详情响应数据（门户网站详情）
export interface InstrumentDetailResponse extends InstrumentListResponse {
  workingPrinciple?: string; // 工作原理（中文）
  workingPrincipleEn?: string; // 工作原理（英文）
  applicationScope?: string; // 应用范围（中文）
  applicationScopeEn?: string; // 应用范围（英文）
  performanceFeatures?: string; // 性能特点（中文）
  performanceFeaturesEn?: string; // 性能特点（英文）
  otherInfo?: string; // 其它说明（中文）
  otherInfoEn?: string; // 其它说明（英文）
}

// 仪器查询参数
export interface InstrumentQueryParams extends PaginationParams {
  instName?: string; // 仪器名称关键词
  manufacturer?: string; // 生产厂家关键词
  model?: string; // 型号关键词
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
