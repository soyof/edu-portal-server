-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 添加一些注释
/*
论文管理表字段说明：
- id: 主键ID，自增长
- title: 论文标题（中文），必填
- title_en: 论文标题（英文），必填
- abstract: 摘要（中文），可选
- abstract_en: 摘要（英文），可选
- publish_status: 发布状态，默认为'0'(未发布)
- paper_publish_time: 论文发布时间（文献原始发布时间），可选
- original_url: 原文地址，可选
- content: 内容（中文），可选
- content_en: 内容（英文），可选
- create_user_id: 创建人，必填
- created_times: 创建时间，自动设置
- update_user_id: 更新人，可选
- updated_times: 更新时间，自动更新
- publish_user_id: 发布人，可选
- publish_times: 发布时间（系统操作时间），可选
*/

-- 创建论文管理表
CREATE TABLE IF NOT EXISTS `paper_infos` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `title` VARCHAR(255) NOT NULL COMMENT '论文标题（中文）',
    `title_en` VARCHAR(255) NOT NULL COMMENT '论文标题（英文）',
    `abstract` TEXT COMMENT '摘要（中文）',
    `abstract_en` TEXT COMMENT '摘要（英文）',
    `publish_status` VARCHAR(1) NOT NULL DEFAULT '0' COMMENT '发布状态：0(未发布),1(已发布),2(已下线)',
    `paper_publish_times` DATETIME COMMENT '论文发布时间（文献原始发布时间）',
    `original_url` VARCHAR(500) COMMENT '原文地址',
    `content` TEXT COMMENT '内容（中文）',
    `content_en` TEXT COMMENT '内容（英文）',
    `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人',
    `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_user_id` VARCHAR(20) COMMENT '更新人',
    `updated_times` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `publish_user_id` VARCHAR(20) COMMENT '发布人',
    `publish_times` DATETIME COMMENT '发布时间（系统操作时间）',
    KEY `idx_title` (`title`),
    KEY `idx_publish_status` (`publish_status`),
    KEY `idx_create_user_id` (`create_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论文管理表'; 
