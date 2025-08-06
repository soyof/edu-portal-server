// 埋点数据类型定义

// 设备信息
export interface DeviceInfo {
  deviceType: string; // desktop/mobile/tablet
  isTouchDevice: boolean;
  deviceMemory?: number; // GB
  hardwareConcurrency?: number; // CPU核心数
}

// 浏览器信息
export interface BrowserInfo {
  name: string; // 浏览器名称
  version: string; // 浏览器版本
  engine?: string; // 浏览器引擎
  language: string; // 主要语言
  languages?: string[]; // 支持的语言列表
  cookieEnabled?: boolean;
  doNotTrack?: boolean;
  onlineStatus?: boolean;
}

// 操作系统信息
export interface OSInfo {
  name: string; // 操作系统名称
  version: string; // 版本
  platform: string; // 平台
}

// 屏幕信息
export interface ScreenInfo {
  width: number; // 屏幕宽度
  height: number; // 屏幕高度
  availWidth?: number; // 可用宽度
  availHeight?: number; // 可用高度
  colorDepth: number; // 颜色深度
  pixelRatio: number; // 设备像素比
  orientation?: string; // 屏幕方向
}

// 点击事件数据
export interface ClickEventData {
  element: string; // 元素类型
  tagName: string; // 标签名
  elementId?: string; // 元素ID
  elementClass?: string; // 元素类名
  elementText?: string; // 元素文本
  elementHtml?: string; // 元素HTML
  elementPath?: string; // 元素路径
  clickX: number; // 点击X坐标
  clickY: number; // 点击Y坐标
  timestamp: number; // 事件时间戳
}

// 页面访问事件数据
export interface PageViewEventData {
  loadTime?: number; // 页面加载时间
  fromSearch?: boolean; // 是否来自搜索
  timestamp: number;
}

// 表单提交事件数据
export interface FormEventData {
  formId?: string; // 表单ID
  formAction?: string; // 表单动作
  fieldCount?: number; // 字段数量
  timestamp: number;
}

// 搜索事件数据
export interface SearchEventData {
  query: string; // 搜索关键词
  resultsCount?: number; // 结果数量
  timestamp: number;
}

// 下载事件数据
export interface DownloadEventData {
  fileName: string; // 文件名
  fileType?: string; // 文件类型
  fileSize?: number; // 文件大小
  timestamp: number;
}

// 事件数据联合类型
export type EventData = ClickEventData | PageViewEventData | FormEventData | SearchEventData | DownloadEventData;

// 埋点请求数据结构
export interface TrackingRequest {
  userId?: string; // 用户ID（可选，匿名用户为空）
  sessionId: string; // 会话ID
  pagePath: string; // 页面路径
  pageTitle?: string; // 页面标题
  userAgent?: string; // User-Agent
  clientIp?: string; // 客户端IP（仅由后端自动获取，忽略前端传入）
  deviceInfo?: DeviceInfo; // 设备信息
  browserInfo?: BrowserInfo; // 浏览器信息
  osInfo?: OSInfo; // 操作系统信息
  screenInfo?: ScreenInfo; // 屏幕信息
  timestamp: number; // 事件时间戳
  referrer?: string; // 来源页面
  eventType: string; // 事件类型
  eventData?: EventData; // 事件详细数据
}

// 埋点响应数据
export interface TrackingResponse {
  success: boolean; // 是否成功
  message: string; // 响应消息
  trackingId?: string; // 埋点记录ID
}

// 限流配置
export interface RateLimitConfig {
  windowMs: number; // 时间窗口（毫秒）
  maxRequests: number; // 最大请求数
  blockDurationMs: number; // 阻止时长（毫秒）
}

// 限流状态
export interface RateLimitStatus {
  key: string; // 限流键
  count: number; // 当前计数
  resetTime: number; // 重置时间
  blocked: boolean; // 是否被阻止
  blockUntil?: number; // 阻止到什么时候
}
