-- 确保使用edu_infos数据库
USE `edu_infos`;

-- 创建系统字典表
CREATE TABLE IF NOT EXISTS `sys_dict` (
  `dict_id` varchar(36) NOT NULL COMMENT '字典ID',
  `dict_type` varchar(100) NOT NULL COMMENT '字典类型编码',
  `dict_type_name` varchar(100) NOT NULL COMMENT '字典类型名称',
  `dict_value` varchar(200) NOT NULL COMMENT '字典值(中文)',
  `dict_value_en` varchar(200) DEFAULT NULL COMMENT '字典值(英文)',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序字段',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
  `create_user_id` varchar(20) NOT NULL COMMENT '创建人(用户编号)',
  `update_user_id` varchar(20) NOT NULL COMMENT '更新人(用户编号)',
  `created_times` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_times` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`dict_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统字典表';

-- 初始化用户职称字典数据
INSERT INTO `sys_dict` (`dict_id`, `dict_type`, `dict_type_name`, `dict_value`, `dict_value_en`, `sort_order`, `remark`, `status`, `create_user_id`, `update_user_id`)
VALUES
('1001', 'user_title', '用户职称', '教授', 'Professor', 10, '教授职称', 1, 'admin', 'admin'),
('1002', 'user_title', '用户职称', '副教授', 'Associate Professor', 20, '副教授职称', 1, 'admin', 'admin'),
('1003', 'user_title', '用户职称', '讲师', 'Lecturer', 30, '讲师职称', 1, 'admin', 'admin'),
('1004', 'user_title', '用户职称', '博士后', 'Postdoctoral Researcher', 40, '博士后研究员', 1, 'admin', 'admin'),
('1005', 'user_title', '用户职称', '博士生', 'PhD Student', 50, '博士研究生', 1, 'admin', 'admin'),
('1006', 'user_title', '用户职称', '硕士生', 'Master Student', 60, '硕士研究生', 1, 'admin', 'admin'),
('1007', 'user_title', '用户职称', '毕业生', 'Graduate', 70, '已毕业学生', 1, 'admin', 'admin'); 

-- 添加通知类型字典数据
INSERT INTO `sys_dict` (`dict_id`, `dict_type`, `dict_type_name`, `dict_value`, `dict_value_en`, `sort_order`, `remark`, `status`, `create_user_id`, `update_user_id`)
VALUES
('2001', 'notice_type', '通知类型', '超链接', 'Hyperlink', 10, '包含超链接的通知', 1, 'admin', 'admin'),
('2002', 'notice_type', '通知类型', '文本', 'Text', 20, '纯文本通知', 1, 'admin', 'admin'); 

-- 添加通知重要程度字典数据
INSERT INTO `sys_dict` (`dict_id`, `dict_type`, `dict_type_name`, `dict_value`, `dict_value_en`, `sort_order`, `remark`, `status`, `create_user_id`, `update_user_id`)
VALUES
('3001', 'notice_importance', '通知重要程度', '普通', 'Normal', 10, '普通重要程度的通知', 1, 'admin', 'admin'),
('3002', 'notice_importance', '通知重要程度', '重要', 'Important', 20, '重要程度较高的通知', 1, 'admin', 'admin'),
('3003', 'notice_importance', '通知重要程度', '紧急', 'Urgent', 30, '紧急重要的通知', 1, 'admin', 'admin'); 

-- 添加招聘信息类型字典数据
INSERT INTO `sys_dict` (`dict_id`, `dict_type`, `dict_type_name`, `dict_value`, `dict_value_en`, `sort_order`, `remark`, `status`, `create_user_id`, `update_user_id`)
VALUES
('4001', 'recruitment_type', '招聘信息类型', '博士后及研究生招生', 'Postdoc & Student Recruitment', 10, '博士后及研究生招生信息', 1, 'admin', 'admin'),
('4002', 'recruitment_type', '招聘信息类型', '工作人员', 'Staff Recruitment', 20, '工作人员招聘信息', 1, 'admin', 'admin'),
('4003', 'recruitment_type', '招聘信息类型', '联系我们', 'Contact Us', 30, '联系方式信息', 1, 'admin', 'admin'); 

-- 添加简介类型字典数据
INSERT INTO `sys_dict` (`dict_id`, `dict_type`, `dict_type_name`, `dict_value`, `dict_value_en`, `sort_order`, `remark`, `status`, `create_user_id`, `update_user_id`)
VALUES
('5001', 'intro_type', '简介类型', '研究所简介', 'Institute Introduction', 10, '研究所基本介绍信息', 1, 'admin', 'admin'),
('5002', 'intro_type', '简介类型', '实验室环境简介', 'Laboratory Environment', 20, '实验室环境及设施介绍', 1, 'admin', 'admin');

-- 添加动态类型字典数据
INSERT INTO `sys_dict` (`dict_id`, `dict_type`, `dict_type_name`, `dict_value`, `dict_value_en`, `sort_order`, `remark`, `status`, `create_user_id`, `update_user_id`)
VALUES
('6001', 'dynamic_type', '动态类型', '科研动态', 'Research Trends', 10, '科研相关动态信息', 1, 'admin', 'admin'),
('6002', 'dynamic_type', '动态类型', '新闻动态', 'News', 20, '一般新闻动态信息', 1, 'admin', 'admin');

-- 添加开源工具类型字典数据
INSERT INTO `sys_dict` (`dict_id`, `dict_type`, `dict_type_name`, `dict_value`, `dict_value_en`, `sort_order`, `remark`, `status`, `create_user_id`, `update_user_id`)
VALUES
('7001', 'opensource_tool_type', '开源工具类型', '遗传部分', 'Genetic Analysis', 10, '遗传分析相关工具', 1, 'admin', 'admin'),
('7002', 'opensource_tool_type', '开源工具类型', '序列设计', 'Sequence Design', 20, '生物序列设计工具', 1, 'admin', 'admin'),
('7003', 'opensource_tool_type', '开源工具类型', '核苷酸序列分析', 'Nucleotide Sequence Analysis', 30, '核苷酸序列分析工具', 1, 'admin', 'admin');
