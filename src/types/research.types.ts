// 科研成果类型定义

// 论文响应数据（门户网站）
export interface PaperResponse {
  id: number; // 主键ID
  title: string; // 论文标题（中文）
  titleEn: string; // 论文标题（英文）
  abstract?: string; // 摘要（中文）
  abstractEn?: string; // 摘要（英文）
  paperPublishTimes?: string; // 论文发布时间（文献原始发布时间）
  originalUrl?: string; // 原文地址
  content?: string; // 内容（中文）
  contentEn?: string; // 内容（英文）
}

// 专利响应数据（门户网站）
export interface PatentResponse {
  id: number; // 主键ID
  title: string; // 专利名称（中文）
  titleEn?: string; // 专利名称（英文）
  patentPublishDate?: string; // 专利发布时间（官方公开日）
  applicants: string; // 申请人（多个用逗号分隔）
  applicationNum: string; // 申请号
  isServicePatent: string; // 是否职务专利：0(否),1(是)
  applicationDate: string; // 申请日期
  authorizationDate?: string; // 授权日期
  abstract?: string; // 摘要（中文）
  abstractEn?: string; // 摘要（英文）
  content?: string; // 内容（中文）
  contentEn?: string; // 内容（英文）
}

// 著作响应数据（门户网站）
export interface BookResponse {
  id: number; // 主键ID
  title: string; // 著作名称（中文）
  titleEn?: string; // 著作名称（英文）
  author: string; // 作者（中文）
  authorEn?: string; // 作者（英文）
  bookPublishDate?: string; // 著作发布日期
  bookUrl?: string; // 著作链接地址
  isTranslated: string; // 是否译成外文：0(否),1(是)
  abstract?: string; // 摘要（中文）
  abstractEn?: string; // 摘要（英文）
  content?: string; // 内容（中文）
  contentEn?: string; // 内容（英文）
}

// 科研成果概览响应数据
export interface ResearchOverviewResponse {
  papers: PaperResponse[]; // 最新论文（前5条）
  papersTotal: number; // 论文总数
  patents: PatentResponse[]; // 最新专利（前5条）
  patentsTotal: number; // 专利总数
  books: BookResponse[]; // 最新著作（前5条）
  booksTotal: number; // 著作总数
}

// 分页查询参数
export interface PaginationParams {
  pageNo?: number; // 页码，默认1
  pageSize?: number; // 每页数量，默认10
}

// 论文查询参数
export interface PaperQueryParams extends PaginationParams {
  title?: string; // 论文标题关键词
  publishYear?: number; // 论文发布年份
  publishMonth?: number; // 论文发布月份（1-12）
}

// 专利查询参数
export interface PatentQueryParams extends PaginationParams {
  title?: string; // 专利标题关键词
  publishYear?: number; // 专利发布年份
  publishMonth?: number; // 专利发布月份（1-12）
}

// 著作查询参数
export interface BookQueryParams extends PaginationParams {
  title?: string; // 著作标题关键词
  author?: string; // 作者关键词
  publishYear?: number; // 著作发布年份
  publishMonth?: number; // 著作发布月份（1-12）
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]; // 记录列表
  total: number; // 总记录数
  pageNo: number; // 当前页码
  pageSize: number; // 每页数量
  totalPages: number; // 总页数
}
