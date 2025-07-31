-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 创建开源工具管理表
CREATE TABLE IF NOT EXISTS `tool_infos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` VARCHAR(200) NOT NULL COMMENT '工具标题(中文)',
  `title_en` VARCHAR(200) DEFAULT NULL COMMENT '工具标题(英文)',
  `description` TEXT COMMENT '工具描述(中文)',
  `description_en` TEXT COMMENT '工具描述(英文)',
  `tool_type` VARCHAR(20) NOT NULL COMMENT '工具类型(7001/7002/7003/...)',
  `tool_url` VARCHAR(500) NOT NULL COMMENT '工具地址',
  `publish_status` VARCHAR(2) NOT NULL DEFAULT '0' COMMENT '发布状态: 0(未发布), 1(已发布), 2(已下线)',
  `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人(用户编号)',
  `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_user_id` VARCHAR(20) NOT NULL COMMENT '更新人(用户编号)',
  `updated_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `publish_user_id` VARCHAR(20) DEFAULT NULL COMMENT '发布人(用户编号)',
  `publish_times` DATETIME DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  INDEX `idx_tool_type` (`tool_type`) COMMENT '工具类型索引',
  INDEX `idx_publish_status` (`publish_status`) COMMENT '发布状态索引',
  INDEX `idx_create_user` (`create_user_id`) COMMENT '创建人索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='开源工具管理表';

