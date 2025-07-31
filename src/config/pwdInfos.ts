// 密码加密 - 前端md5(md5(pw + pwdPrefix))
// 后端获取到数据后，再次进行md5(md5(pw + pwdSuffix))
export const pwdPrefix = 'edu_sh'
export const pwdSuffix = 'edu_zjq'
