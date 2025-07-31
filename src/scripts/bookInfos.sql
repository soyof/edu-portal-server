-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 添加一些注释
/*
著作管理表字段说明：
- id: 主键ID，自增长
- title: 著作名称（中文），必填
- title_en: 著作名称（英文），可选
- author: 作者（中文），必填
- author_en: 作者（英文），可选
- book_publish_date: 著作发布日期，可选
- book_url: 著作链接地址，可选
- is_translated: 是否译成外文，默认为'0'(否)
- abstract: 摘要（中文），必填
- abstract_en: 摘要（英文），可选
- content: 内容（中文），必填
- content_en: 内容（英文），可选
- publish_status: 发布状态，默认为'0'(未发布)
- create_user_id: 创建人，必填
- created_times: 创建时间，自动设置
- update_user_id: 更新人，可选
- updated_times: 更新时间，自动更新
- publish_user_id: 发布人，可选
- publish_times: 发布时间（系统操作时间），可选
*/

-- 创建著作管理表
CREATE TABLE IF NOT EXISTS `book_infos` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    -- 著作基本信息
    `title` VARCHAR(255) NOT NULL COMMENT '著作名称（中文）',
    `title_en` VARCHAR(255) COMMENT '著作名称（英文）',
    `author` VARCHAR(255) NOT NULL COMMENT '作者（中文）',
    `author_en` VARCHAR(255) COMMENT '作者（英文）',
    -- 著作时间信息
    `book_publish_date` DATE COMMENT '著作发布日期',
    -- 著作属性
    `book_url` VARCHAR(500) COMMENT '著作链接地址',
    `is_translated` VARCHAR(1) NOT NULL DEFAULT '0' COMMENT '是否译成外文：0(否),1(是)',
    -- 著作内容
    `abstract` TEXT COMMENT '摘要（中文）',
    `abstract_en` TEXT COMMENT '摘要（英文）',
    `content` TEXT COMMENT '内容（中文）',
    `content_en` TEXT COMMENT '内容（英文）',
    -- 发布状态
    `publish_status` VARCHAR(1) NOT NULL DEFAULT '0' COMMENT '发布状态：0(未发布),1(已发布),2(已下线)',
    -- 审计字段
    `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人',
    `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_user_id` VARCHAR(20) COMMENT '更新人',
    `updated_times` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `publish_user_id` VARCHAR(20) COMMENT '发布人',
    `publish_times` DATETIME COMMENT '发布时间（系统操作时间）',
    -- 索引优化
    INDEX `idx_title` (`title`),
    INDEX `idx_author` (`author`),
    INDEX `idx_book_publish_date` (`book_publish_date`),
    INDEX `idx_publish_status` (`publish_status`),
    INDEX `idx_created_times` (`created_times`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='著作管理表'; 
