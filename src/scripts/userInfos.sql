-- 确保使用edu_infos数据库
USE `edu_infos`;
-- 添加一些注释
/*
用户表字段说明：
- user_id: 主键，用于登录的用户ID
- username: 用户名
- password: 密码，使用bcrypt加密存储
- phone: 手机号码，可选
- email: 邮箱地址，唯一
- lab_homepage: 实验室主页URL，可选
- personal_homepage: 个人主页URL，可选
- tags: 用户标签，以JSON格式存储，例如: ["AI", "机器学习", "教育"]
- avatar: 用户头像URL，可选
- id_pic: 用户证件照URL，可选
- role: 用户角色，默认为"user"
- is_active: 账号是否激活，默认为true
- created_times: 创建时间，自动设置
- updated_times: 更新时间，自动更新
*/
-- 创建用户信息表
CREATE TABLE IF NOT EXISTS `user_infos` (
  `user_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户ID，主键，用于登录',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码，加密存储',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号码',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱地址',
  `lab_homepage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '实验室主页URL',
  `personal_homepage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '个人主页URL',
  `tags` text COLLATE utf8mb4_unicode_ci COMMENT '用户标签',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像URL',
  `id_pic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户证件照URL',
  `title` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户职称',
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT '用户角色：admin, user等',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '账号状态：1：正常，0：禁用',
  `created_times` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_times` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- 插入示例数据
insert into `user_infos` (`user_id`, `username`, `password`, `phone`, `email`, `lab_homepage`, `personal_homepage`, `tags`, `avatar`, `id_pic`, `title`, `role`, `status`, `created_times`, `updated_times`) values('admin','管理员','2fb69304a74aae43cd5c66770ed4ec9b','13800138000','admin@example.com','https://lab.example.com','https://personal.example.com/admin','教育,管理','https://example.com/avatars/admin.jpg','https://example.com/id_pics/admin.jpg','教授','admin','1','2025-06-07 21:29:22','2025-06-07 22:40:04');


-- 注意：示例中的密码都是加密后的"password123"，实际应用中应该为每个用户生成不同的密码 

