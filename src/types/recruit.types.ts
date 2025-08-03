// 招聘信息类型定义

// 招聘信息响应数据
export interface RecruitResponse {
  id: number; // 招聘信息ID
  recruitmentType: string; // 招聘类型(对应字典表dict_id)
  content: string; // 中文内容
  contentEn?: string; // 英文内容
  status: string; // 状态: 1(生效中), 2(已存档), 0(未发布)
  publishUserId?: string; // 发布人(用户编号)
  publishTimes?: string; // 发布时间
  createUserId: string; // 创建人(用户编号)
  createdTimes: string; // 创建时间
  updateUserId: string; // 更新人(用户编号)
  updatedTimes: string; // 更新时间
}

// 招聘信息分类响应数据
export interface RecruitmentByTypeResponse {
  recruitmentType: string; // 招聘类型(字典ID)
  typeName: string; // 招聘类型名称(中文)
  typeNameEn?: string; // 招聘类型名称(英文)
  items: RecruitResponse[]; // 该类型下的招聘信息列表
}

// 招聘信息查询参数
export interface RecruitQueryParams {
  [key: string]: any; // 允许扩展
}
