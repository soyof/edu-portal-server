// 实验室简介查询参数
export interface LabProfileQueryParams {
  pageNo?: number; // 页码
  pageSize?: number; // 每页条数
  profileType?: string; // 简介类型: 5001(研究所简介), 5002(实验室环境简介)
  title?: string; // 简介标题
  publishStatus?: string; // 发布状态: 0(未发布), 1(已发布), 2(已下线)
  createUserId?: string; // 创建人(模糊查询，可以是用户id或用户名称)
  updateUserId?: string; // 更新人(模糊查询，可以是用户id或用户名称)
  publishUserId?: string; // 发布人(模糊查询，可以是用户id或用户名称)
  publishTimesRange?: string[]; // 发布时间范围
  updatedTimesRange?: string[]; // 更新时间范围
}

// 实验室简介新增/修改参数
export interface LabProfileCreateUpdateParams {
  id?: number; // 简介ID，存在则为修改，不存在则为新增
  profileType: string; // 简介类型: 5001(研究所简介), 5002(实验室环境简介)
  title: string; // 简介标题
  content?: string; // 简介内容
  contentEn?: string; // 简介内容(英文)
  publishStatus?: string; // 发布状态: 0(未发布), 1(已发布), 2(已下线)，新增时默认为'0'
}

// 实验室简介响应数据
export interface LabProfileResponse {
  id: number; // 简介ID
  profileType: string; // 简介类型
  title: string; // 简介标题
  content?: string; // 简介内容
  contentEn?: string; // 简介内容(英文)
  publishTimes?: string; // 发布时间
  publishUserId?: string; // 发布人(用户编号)
  publishUserName?: string; // 发布人(用户名称)
  createUserId: string; // 创建人(用户编号)
  updateUserId: string; // 更新人(用户编号)
  createUserName: string; // 创建人(用户名称)
  updateUserName: string; // 更新人(用户名称)
  publishStatus: string; // 发布状态: 0(未发布), 1(已发布), 2(已下线)
  createdTimes: string; // 创建时间
  updatedTimes: string; // 更新时间
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]; // 记录列表
  total: number; // 总记录数
  pages: number; // 总页数
  pageNo: number; // 当前页码
  pageSize: number; // 每页大小
}
