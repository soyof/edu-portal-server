// 用户查询参数
export interface UserQueryParams {
  // 预留扩展字段
  [key: string]: any;
}

// 用户基本信息响应数据
export interface UserInfoResponse {
  userId: string; // 用户ID
  username: string; // 用户名
  email?: string; // 邮箱地址
  phone?: string; // 手机号码
  title?: string; // 职称
  tags?: string[]; // 用户标签数组
  avatar?: string; // 用户头像URL
  idPic?: string; // 用户证件照URL
  labHomepage?: string; // 实验室主页URL
  personalHomepage?: string; // 个人主页URL
  createdTimes: string; // 创建时间
  updatedTimes: string; // 更新时间
}

// 用户完整信息响应数据（用于详情接口）
export interface UserDetailResponse {
  userId: string; // 用户ID
  username: string; // 用户名
  password: string; // 密码（加密后的）
  phone?: string; // 手机号码
  email?: string; // 邮箱地址
  labHomepage?: string; // 实验室主页URL
  personalHomepage?: string; // 个人主页URL
  tags?: string[]; // 用户标签数组
  avatar?: string; // 用户头像URL
  idPic?: string; // 用户证件照URL
  title?: string; // 用户职称
  bio?: string; // 个人简介(中文)
  bioEn?: string; // 个人简介(英文)
  researchDirection?: string; // 研究方向(中文)
  researchDirectionEn?: string; // 研究方向(英文)
  researchProject?: string; // 课题项目(中文)
  researchProjectEn?: string; // 课题项目(英文)
  academicAppointment?: string; // 学术兼职(中文)
  academicAppointmentEn?: string; // 学术兼职(英文)
  awards?: string; // 获奖情况(中文)
  awardsEn?: string; // 获奖情况(英文)
  academicResearch?: string; // 学术研究(中文)
  academicResearchEn?: string; // 学术研究(英文)
  publications?: string; // 论文发表(中文)
  publicationsEn?: string; // 论文发表(英文)
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
