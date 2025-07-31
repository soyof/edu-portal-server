-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 创建实验室简介管理表
CREATE TABLE IF NOT EXISTS `lab_profile_infos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '简介ID',
    `profile_type` VARCHAR(20) NOT NULL COMMENT '简介类型: 5001(研究所简介), 5002(实验室环境简介)',
    `title` VARCHAR(255) NOT NULL COMMENT '简介标题',
    `content` TEXT COMMENT '简介内容(中文)',
    `content_en` TEXT COMMENT '简介内容(英文)',
    `publish_status` VARCHAR(2) NOT NULL DEFAULT '0' COMMENT '发布状态: 0(未发布), 1(已发布), 2(已下线)',
    `publish_user_id` VARCHAR(20) DEFAULT NULL COMMENT '发布人(用户编号)',
    `publish_times` DATETIME COMMENT '发布时间',
    `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人(用户编号)',
    `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_user_id` VARCHAR(20) NOT NULL COMMENT '更新人(用户编号)',
    `updated_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    KEY `idx_profile_type` (`profile_type`) COMMENT '简介类型索引',
    KEY `idx_publish_status` (`publish_status`) COMMENT '发布状态索引',
    KEY `idx_create_user` (`create_user_id`) COMMENT '创建人索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='实验室简介管理表';
