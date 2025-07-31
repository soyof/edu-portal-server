-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 添加一些注释
/*
专利管理表字段说明：
- id: 主键ID，自增长
- title: 专利名称（中文），必填
- title_en: 专利名称（英文），可选
- patent_publish_date: 专利发布时间（官方公开日），可选
- applicants: 申请人（多个用逗号分隔），必填
- application_num: 申请号，必填，唯一
- is_service_patent: 是否职务专利，默认为'0'(否)
- application_date: 申请日期，必填
- authorization_date: 授权日期，可选
- abstract: 摘要（中文），可选
- abstract_en: 摘要（英文），可选
- content: 内容（中文），可选
- content_en: 内容（英文），可选
- publish_status: 发布状态，默认为'0'(未发布)
- create_user_id: 创建人，必填
- created_times: 创建时间，自动设置
- update_user_id: 更新人，可选
- updated_times: 更新时间，自动更新
- publish_user_id: 发布人，可选
- publish_times: 发布时间（系统操作时间），可选
*/

-- 创建专利管理表
CREATE TABLE IF NOT EXISTS `patent_infos` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `title` VARCHAR(255) NOT NULL COMMENT '专利名称（中文）',
    `title_en` VARCHAR(255) COMMENT '专利名称（英文）',
    `patent_publish_date` DATE COMMENT '专利发布时间（官方公开日）',
    `applicants` VARCHAR(500) NOT NULL COMMENT '申请人（多个用逗号分隔）',
    `application_num` VARCHAR(50) NOT NULL UNIQUE COMMENT '申请号',
    `is_service_patent` VARCHAR(1) NOT NULL DEFAULT '0' COMMENT '是否职务专利：0(否),1(是)',
    `application_date` DATE NOT NULL COMMENT '申请日期',
    `authorization_date` DATE COMMENT '授权日期',
    `abstract` TEXT COMMENT '摘要（中文）',
    `abstract_en` TEXT COMMENT '摘要（英文）',
    `content` TEXT COMMENT '内容（中文）',
    `content_en` TEXT COMMENT '内容（英文）',
    `publish_status` VARCHAR(1) NOT NULL DEFAULT '0' COMMENT '发布状态：0(未发布),1(已发布),2(已下线)',
    `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人',
    `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_user_id` VARCHAR(20) COMMENT '更新人',
    `updated_times` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `publish_user_id` VARCHAR(20) COMMENT '发布人',
    `publish_times` DATETIME COMMENT '发布时间（系统操作时间）',
    KEY `idx_title` (`title`),
    KEY `idx_application_date` (`application_date`),
    KEY `idx_publish_status` (`publish_status`),
    KEY `idx_create_user_id` (`create_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专利管理表';
