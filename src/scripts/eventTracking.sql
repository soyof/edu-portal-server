-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 创建埋点事件跟踪表
CREATE TABLE IF NOT EXISTS `event_tracking` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` VARCHAR(64) DEFAULT NULL COMMENT '用户ID(关联user_infos表,匿名用户为NULL)',
  `session_id` VARCHAR(64) NOT NULL COMMENT '会话ID',
  `event_type` VARCHAR(20) NOT NULL COMMENT '事件类型(由前端自定义)',
  
  -- 页面基础信息
  `page_path` VARCHAR(255) NOT NULL COMMENT '页面路径',
  `page_title` VARCHAR(255) DEFAULT NULL COMMENT '页面标题',
  `referrer` VARCHAR(500) DEFAULT NULL COMMENT '来源页面URL',
  
  -- 设备与环境信息
  `user_agent` TEXT COMMENT '完整User-Agent字符串',
  `client_ip` VARCHAR(45) DEFAULT NULL COMMENT '客户端IP地址',
  `device_type` VARCHAR(20) DEFAULT NULL COMMENT '设备类型(由前端自定义)',
  `device_memory` SMALLINT UNSIGNED DEFAULT NULL COMMENT '设备内存(GB)',
  `hardware_concurrency` SMALLINT UNSIGNED DEFAULT NULL COMMENT 'CPU核心数',
  
  -- 浏览器信息
  `browser_name` VARCHAR(50) DEFAULT NULL COMMENT '浏览器名称',
  `browser_version` VARCHAR(50) DEFAULT NULL COMMENT '浏览器版本',
  `browser_language` VARCHAR(20) DEFAULT NULL COMMENT '浏览器语言',
  
  -- 操作系统信息
  `os_name` VARCHAR(50) DEFAULT NULL COMMENT '操作系统名称',
  `os_version` VARCHAR(50) DEFAULT NULL COMMENT '操作系统版本',
  
  -- 屏幕信息
  `screen_width` SMALLINT UNSIGNED DEFAULT NULL COMMENT '屏幕宽度(像素)',
  `screen_height` SMALLINT UNSIGNED DEFAULT NULL COMMENT '屏幕高度(像素)',
  `color_depth` TINYINT UNSIGNED DEFAULT NULL COMMENT '颜色深度(位)',
  `pixel_ratio` DECIMAL(3,2) DEFAULT NULL COMMENT '设备像素比',
  
  -- 时间信息
  `event_timestamp` BIGINT UNSIGNED NOT NULL COMMENT '事件时间戳(毫秒)',
  `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  
  -- 事件详情(JSON格式存储动态数据)
  `event_data` JSON COMMENT '事件详细数据(如点击元素、表单字段等)',
  
  -- 状态字段
  `status` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '记录状态: 1(有效), 0(无效)',
  
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`) COMMENT '用户ID索引',
  INDEX `idx_session_id` (`session_id`) COMMENT '会话ID索引',
  INDEX `idx_event_type` (`event_type`) COMMENT '事件类型索引',
  INDEX `idx_event_timestamp` (`event_timestamp`) COMMENT '事件时间戳索引',
  INDEX `idx_page_path` (`page_path`(64)) COMMENT '页面路径索引(前64字符)',
  INDEX `idx_client_ip` (`client_ip`) COMMENT '客户端IP索引',
  INDEX `idx_created_times` (`created_times`) COMMENT '创建时间索引',
  INDEX `idx_device_type` (`device_type`) COMMENT '设备类型索引',
  INDEX `idx_status` (`status`) COMMENT '状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为埋点事件跟踪表';
