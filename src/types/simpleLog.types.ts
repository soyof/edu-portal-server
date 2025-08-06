// 简化埋点日志类型定义

// 简化日志请求数据结构（复用现有log接口的前端参数）
export interface SimpleLogRequest {
  userId?: string; // 用户ID（可选，匿名用户为空）
  sessionId: string; // 会话ID
  eventType: string; // 事件类型
  pagePath: string; // 页面路径
  pageTitle?: string; // 页面标题
  // clientIp 由后端自动获取，不需要前端传入
  browserInfo?: {
    name?: string; // 浏览器名称
    version?: string; // 浏览器版本
    language?: string; // 浏览器语言
  };
  osInfo?: {
    name?: string; // 操作系统名称
    version?: string; // 操作系统版本
  };
  // 其他字段会被忽略，只保存上述指定的字段
}

// 简化日志响应数据
export interface SimpleLogResponse {
  success: boolean; // 是否成功
  message: string; // 响应消息
  logId?: string; // 日志记录ID
}

// 简化日志存储数据结构（映射到event_tracking表的部分字段）
export interface SimpleLogData {
  userId: string | null; // 用户ID
  sessionId: string; // 会话ID
  eventType: string; // 事件类型
  pagePath: string; // 页面路径
  pageTitle: string | null; // 页面标题
  clientIp: string; // 客户端IP地址（后端获取）
  browserName: string | null; // 浏览器名称
  browserVersion: string | null; // 浏览器版本
  browserLanguage: string | null; // 浏览器语言
  osName: string | null; // 操作系统名称
  osVersion: string | null; // 操作系统版本
  // created_times 由数据库自动生成
  // status 默认为1（有效）
}
