// 字典查询参数
export interface DictQueryParams {
  dictType: string; // 字典类型编码，必填
}

// 字典响应数据
export interface DictResponse {
  dictId: string; // 字典ID
  dictType: string; // 字典类型编码
  dictTypeName: string; // 字典类型名称
  dictValue: string; // 字典值(中文)
  dictValueEn?: string; // 字典值(英文)
  sortOrder: number; // 排序字段
  remark?: string; // 备注
  createdTimes: string; // 创建时间
  updatedTimes: string; // 更新时间
}
