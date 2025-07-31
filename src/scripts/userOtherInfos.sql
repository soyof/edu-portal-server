-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 创建用户其他信息表
CREATE TABLE IF NOT EXISTS `user_other_infos` (
  `user_id` VARCHAR(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户ID，主键，关联user_infos表',
  `bio` TEXT COLLATE utf8mb4_unicode_ci COMMENT '个人简介(中文)',
  `bio_en` TEXT COLLATE utf8mb4_unicode_ci COMMENT '个人简介(英文)',
  `research_direction` TEXT COLLATE utf8mb4_unicode_ci COMMENT '研究方向(中文)',
  `research_direction_en` TEXT COLLATE utf8mb4_unicode_ci COMMENT '研究方向(英文)',
  `research_project` TEXT COLLATE utf8mb4_unicode_ci COMMENT '课题项目(中文)',
  `research_project_en` TEXT COLLATE utf8mb4_unicode_ci COMMENT '课题项目(英文)',
  `academic_appointment` TEXT COLLATE utf8mb4_unicode_ci COMMENT '学术兼职(中文)',
  `academic_appointment_en` TEXT COLLATE utf8mb4_unicode_ci COMMENT '学术兼职(英文)',
  `awards` TEXT COLLATE utf8mb4_unicode_ci COMMENT '获奖情况(中文)',
  `awards_en` TEXT COLLATE utf8mb4_unicode_ci COMMENT '获奖情况(英文)',
  `academic_research` TEXT COLLATE utf8mb4_unicode_ci COMMENT '学术研究(中文)',
  `academic_research_en` TEXT COLLATE utf8mb4_unicode_ci COMMENT '学术研究(英文)',
  `publications` TEXT COLLATE utf8mb4_unicode_ci COMMENT '论文发表(中文)',
  `publications_en` TEXT COLLATE utf8mb4_unicode_ci COMMENT '论文发表(英文)',
  `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_other_infos_user` FOREIGN KEY (`user_id`) REFERENCES `user_infos` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户其他信息表';

-- 为管理员账号添加示例数据
INSERT INTO `user_other_infos` (`user_id`, `bio`, `bio_en`, `research_direction`, `research_direction_en`) 
VALUES ('admin', '教育管理专家，拥有丰富的学术和管理经验。', 'Education management expert with rich academic and administrative experience.', 
'教育技术，人工智能教育应用', 'Educational technology, AI applications in education'); 
