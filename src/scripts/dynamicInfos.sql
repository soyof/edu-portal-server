-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 创建动态信息表
CREATE TABLE IF NOT EXISTS `dynamic_infos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '动态ID',
  `title` VARCHAR(255) NOT NULL COMMENT '中文标题',
  `title_en` VARCHAR(255) DEFAULT NULL COMMENT '英文标题',
  `publish_status` VARCHAR(2) NOT NULL DEFAULT '0' COMMENT '发布状态: 0(未发布), 1(已发布), 2(已下线)',
  `dynamic_type` VARCHAR(20) NOT NULL COMMENT '动态类型: 6001(科研动态), 6002(新闻动态)',
  `content` TEXT NOT NULL COMMENT '中文内容',
  `content_en` TEXT DEFAULT NULL COMMENT '英文内容',
  `create_user_id` VARCHAR(20) NOT NULL COMMENT '创建人(用户编号)',
  `created_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `publish_user_id` VARCHAR(20) DEFAULT NULL COMMENT '发布人(用户编号)',
  `publish_times` DATETIME DEFAULT NULL COMMENT '发布时间',
  `update_user_id` VARCHAR(20) NOT NULL COMMENT '更新人(用户编号)',
  `updated_times` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_dynamic_type` (`dynamic_type`) COMMENT '动态类型索引',
  KEY `idx_publish_status` (`publish_status`) COMMENT '发布状态索引',
  KEY `idx_create_user` (`create_user_id`) COMMENT '创建人索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态信息表';

-- 插入测试数据
INSERT INTO `dynamic_infos` (`title`, `title_en`, `publish_status`, `dynamic_type`, `content`, `content_en`, `create_user_id`, `publish_user_id`, `publish_times`, `update_user_id`) VALUES
('人工智能研究取得重大突破', 'Major Breakthrough in AI Research', '1', '6001', '我们实验室在人工智能领域取得了重大研究突破，开发出了新一代深度学习算法...', 'Our laboratory has achieved a major research breakthrough in the field of artificial intelligence...', 'admin', 'admin', NOW(), 'admin'),
('量子计算研究进展报告', 'Quantum Computing Research Progress Report', '1', '6001', '量子计算团队在过去一年中取得了显著进展，成功实现了量子纠缠态的稳定控制...', 'The quantum computing team has made significant progress over the past year...', 'admin', 'admin', NOW(), 'admin'),
('生物信息学新方法发布', 'New Bioinformatics Methods Released', '1', '6001', '我们开发了一套全新的生物信息学分析方法，能够更准确地预测蛋白质结构...', 'We have developed a new set of bioinformatics analysis methods...', 'admin', 'admin', NOW(), 'admin'),
('学术会议成功举办', 'Academic Conference Successfully Held', '1', '6002', '第十届国际计算机科学大会在我校成功举办，来自世界各地的专家学者齐聚一堂...', 'The 10th International Computer Science Conference was successfully held at our university...', 'admin', 'admin', NOW(), 'admin'),
('新实验室正式启用', 'New Laboratory Officially Opened', '1', '6002', '我校新建的先进材料实验室正式启用，配备了世界一流的研究设备...', 'The newly built Advanced Materials Laboratory at our university is officially opened...', 'admin', 'admin', NOW(), 'admin');
