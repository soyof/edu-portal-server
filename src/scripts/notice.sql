-- 创建通知表
CREATE TABLE IF NOT EXISTS `notice_infos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '通知ID',
    `title` VARCHAR(255) NOT NULL COMMENT '通知标题',
    `title_en` VARCHAR(255) COMMENT '通知标题(英文)',
    `notice_type` VARCHAR(20) COMMENT '通知类型: 2001(超链接), 2002(文本)',
    `importance` VARCHAR(20) COMMENT '重要程度: 3001(普通), 3002(重要), 3003(紧急)',
    `publish_status` VARCHAR(2) NOT NULL DEFAULT '0' COMMENT '发布状态: 0(未发布), 1(已发布), 2(已下线)',
    `link_url` VARCHAR(1000) COMMENT '超链接地址',
    `content` TEXT COMMENT '通知内容',
    `content_en` TEXT COMMENT '通知内容(英文)',
    `publish_user_id` VARCHAR(20) DEFAULT NULL COMMENT '发布人(用户编号)',
    `publish_times` DATETIME COMMENT '发布时间',
    `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人(用户编号)',
    `created_times` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_user_id` VARCHAR(20) NOT NULL COMMENT '更新人(用户编号)',
    `updated_times` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知管理表'; 
