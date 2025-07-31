-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 创建招聘信息表
CREATE TABLE IF NOT EXISTS `recruit_infos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '招聘信息ID',
    `recruitment_type` VARCHAR(50) NOT NULL COMMENT '招聘类型(对应字典表dict_id): student_recruitment(博士后及研究生招生), staff_recruitment(工作人员), contact_us(联系我们)',
    `content` TEXT NOT NULL COMMENT '中文内容',
    `content_en` TEXT DEFAULT NULL COMMENT '英文内容',
    `status` VARCHAR(20) NOT NULL DEFAULT '0' COMMENT '状态: 1(生效中), 2(已存档), 0(未发布)',
    `publish_user_id` VARCHAR(20) DEFAULT NULL COMMENT '发布人(用户编号)', 
    `publish_times` DATETIME DEFAULT NULL COMMENT '发布时间',
    `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人(用户编号)',
    `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_user_id` VARCHAR(20) NOT NULL COMMENT '更新人(用户编号)',
    `updated_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    KEY `idx_status` (`status`) COMMENT '状态索引',
    KEY `idx_recruitment_type` (`recruitment_type`) COMMENT '招聘类型索引',
    KEY `idx_create_user` (`create_user_id`) COMMENT '创建人索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='招聘信息表'; 
