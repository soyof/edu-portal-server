# SQL脚本使用指南

本项目包含SQL脚本，用于创建和管理数据库表结构。

## 用户表结构

用户表(`users`)包含以下字段：

| 字段名 | 类型 | 描述 | 是否必填 |
|-------|------|------|---------|
| id | INT UNSIGNED | 用户ID，自增主键 | 是 |
| username | VARCHAR(50) | 用户名，用于登录，唯一 | 是 |
| password | VARCHAR(100) | 密码，加密存储 | 是 |
| nickname | VARCHAR(50) | 用户昵称 | 否 |
| phone | VARCHAR(20) | 手机号码 | 否 |
| email | VARCHAR(100) | 邮箱地址，唯一 | 是 |
| lab_homepage | VARCHAR(255) | 实验室主页URL | 否 |
| personal_homepage | VARCHAR(255) | 个人主页URL | 否 |
| tags | TEXT | 用户标签，以JSON格式存储 | 否 |
| role | VARCHAR(20) | 用户角色：admin, user等 | 是 |
| is_active | BOOLEAN | 账号是否激活 | 是 |
| created_at | TIMESTAMP | 创建时间 | 是 |
| updated_at | TIMESTAMP | 更新时间 | 是 |

### 索引

- 主键: `id`
- 唯一索引: `username`, `email`
- 普通索引: `phone`, `role`

## 如何使用SQL脚本

### 1. 初始化数据库

首先，确保创建了数据库：

```bash
npm run init-db
```

这将创建名为`edu_system`的数据库（或您在`.env`文件中指定的名称）。

### 2. 创建表结构

运行以下命令创建表结构：

```bash
npm run setup-tables
```

这将执行`src/scripts/create-tables.sql`脚本，创建用户表并插入一些示例数据。

### 3. 完整设置

如果您想一次性完成所有设置（创建数据库、创建表、编译项目），可以运行：

```bash
npm run setup
```

## 手动执行SQL脚本

如果您想手动执行SQL脚本，可以使用MySQL命令行工具：

```bash
mysql -u root -p edu_system < src/scripts/create-tables.sql
```

或者使用MySQL Workbench等图形界面工具执行脚本。

## 示例数据

脚本会插入以下示例用户：

1. **管理员**
   - 用户名: admin
   - 密码: password123
   - 角色: admin

2. **教师**
   - 用户名: teacher1
   - 密码: password123
   - 角色: teacher

3. **学生**
   - 用户名: student1
   - 密码: password123
   - 角色: student

## 注意事项

- 所有密码在数据库中都是加密存储的
- 用户标签以JSON数组格式存储，例如: `["AI", "机器学习", "教育"]`
- 在生产环境中，应该移除示例数据的插入语句 
