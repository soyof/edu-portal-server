-- 创建实验室仪器管理表
CREATE TABLE IF NOT EXISTS `instruments_infos` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    -- 仪器基本信息
    `inst_name` VARCHAR(255) NOT NULL COMMENT '仪器名称（中文）',
    `inst_name_en` VARCHAR(255) COMMENT '仪器名称（英文）',
    `manufacturer` VARCHAR(255) NOT NULL COMMENT '生产厂家（中文）',
    `manufacturer_en` VARCHAR(255) COMMENT '生产厂家（英文）',
    `model` VARCHAR(100) NOT NULL COMMENT '型号',
    -- 技术信息
    `working_principle` TEXT COMMENT '工作原理（中文）',
    `working_principle_en` TEXT COMMENT '工作原理（英文）',
    `application_scope` TEXT COMMENT '应用范围（中文）',
    `application_scope_en` TEXT COMMENT '应用范围（英文）',
    `performance_features` TEXT COMMENT '性能特点（中文）',
    `performance_features_en` TEXT COMMENT '性能特点（英文）',
    `other_info` TEXT COMMENT '其它说明（中文）',
    `other_info_en` TEXT COMMENT '其它说明（英文）',
    `image_files` JSON COMMENT '仪器图片（存储文件名数组）',
    `publish_status` VARCHAR(1) NOT NULL DEFAULT '0' COMMENT '发布状态：0(未发布),1(已发布),2(已下线)',
    `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人',
    `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_user_id` VARCHAR(20) COMMENT '更新人',
    `updated_times` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `publish_user_id` VARCHAR(20) COMMENT '发布人',
    `publish_times` DATETIME COMMENT '发布时间',
    INDEX `idx_inst_name` (`inst_name`),
    INDEX `idx_manufacturer` (`manufacturer`),
    INDEX `idx_model` (`model`),
    INDEX `idx_publish_status` (`publish_status`),
    INDEX `idx_created_times` (`created_times`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='实验室仪器管理表'; 
