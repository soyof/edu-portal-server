/**
 * API响应类型
 */
export interface ApiResponse<T = any> {
  status: number;
  errorCode: number;
  message: string;
  data: T | null;
}

/**
 * API错误码枚举
 */
/* eslint-disable no-unused-vars */
export enum ErrorCode {
  SUCCESS = 0, // 成功
  USER_NOT_EXIST = 101, // 用户不存在
  INVALID_PASSWORD = 102, // 密码错误
  USER_DISABLED = 103, // 用户账号已被禁用
  TOKEN_GENERATE_FAILED = 104, // 令牌生成失败
  SERVER_ERROR = 500, // 服务器内部错误
  UNAUTHORIZED = 401, // 未授权
  FORBIDDEN = 403, // 禁止访问
  NOT_FOUND = 404, // 资源不存在
  VALIDATION_ERROR = 422, // 数据验证错误
  USER_ALREADY_EXIST = 409 // 用户已存在
}

/**
 * 创建成功响应
 * @param data 响应数据
 * @param message 成功信息
 * @returns 统一格式的成功响应
 */
export function success<T>(data: T, message: string = '操作成功'): ApiResponse<T> {
  return {
    status: 200,
    errorCode: ErrorCode.SUCCESS,
    message,
    data
  }
}

/**
 * 创建错误响应
 * @param errorCode 错误码
 * @param message 错误信息
 * @param status HTTP状态码，默认200
 * @returns 统一格式的错误响应
 */
export function error<T = any>(errorCode: number, message: string, status: number = 200): ApiResponse<T> {
  return {
    status,
    errorCode,
    message,
    data: null
  }
}

/**
 * 常用错误响应快捷方法
 */
export const errors = {
  userNotExist: <T = any>(message: string = '用户不存在') =>
    error<T>(ErrorCode.USER_NOT_EXIST, message),

  userAlreadyExist: <T = any>(message: string = '用户已存在') =>
    error<T>(ErrorCode.USER_ALREADY_EXIST, message),

  invalidPassword: <T = any>(message: string = '密码错误') =>
    error<T>(ErrorCode.INVALID_PASSWORD, message),

  userDisabled: <T = any>(message: string = '用户账号已被禁用') =>
    error<T>(ErrorCode.USER_DISABLED, message),

  tokenGenerateFailed: <T = any>(message: string = '生成认证令牌失败') =>
    error<T>(ErrorCode.TOKEN_GENERATE_FAILED, message),

  serverError: <T = any>(message: string = '服务器内部错误') =>
    error<T>(ErrorCode.SERVER_ERROR, message),

  unauthorized: <T = any>(message: string = '未授权访问') =>
    error<T>(ErrorCode.UNAUTHORIZED, message),

  forbidden: <T = any>(message: string = '禁止访问') =>
    error<T>(ErrorCode.FORBIDDEN, message),

  notFound: <T = any>(message: string = '资源不存在') =>
    error<T>(ErrorCode.NOT_FOUND, message),

  validationError: <T = any>(message: string = '数据验证错误') =>
    error<T>(ErrorCode.VALIDATION_ERROR, message)
}
