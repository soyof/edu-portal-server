# 数据库设置指南

## 问题：直接访问域名+端口时报错"数据库连接错误"

当您直接访问域名+端口（例如 http://localhost:3001）时，如果遇到"数据库连接错误"，可能是由以下原因导致的：

1. MySQL数据库服务未启动
2. 数据库不存在
3. 数据库连接配置不正确（用户名、密码、主机、端口等）

## 解决方案

### 1. 确保MySQL服务已启动

- Windows: 在服务管理器中检查MySQL服务是否运行
- Linux: 运行 `systemctl status mysql` 或 `service mysql status`
- macOS: 运行 `brew services list` 检查MySQL服务状态

### 2. 初始化数据库

我们提供了一个初始化脚本来自动创建数据库。运行以下命令：

```bash
npm run init-db
```

这将：
- 连接到MySQL服务器
- 检查数据库是否存在
- 如果不存在，则创建数据库

### 3. 检查环境变量配置

确保您的`.env`文件包含正确的数据库连接信息：

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=edu_system
```

根据您的实际MySQL配置修改这些值。

### 4. 完整设置流程

如果您是首次设置项目，请按照以下步骤操作：

1. 安装依赖：
   ```bash
   npm install
   ```

2. 创建并配置`.env`文件（参考上面的示例）

3. 初始化数据库并构建项目：
   ```bash
   npm run setup
   ```

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

现在，您应该可以成功访问 http://localhost:3001 并看到欢迎页面，而不是数据库错误。

## 调试数据库连接问题

如果您仍然遇到数据库连接问题，可以查看服务器日志以获取更详细的错误信息。我们的系统会记录以下信息：

- 数据库连接尝试
- 连接成功或失败的详细信息
- 具体的错误代码和消息

常见的错误代码及解决方案：

- `ECONNREFUSED`: 无法连接到数据库服务器，确认数据库服务是否启动
- `ER_ACCESS_DENIED_ERROR`: 数据库访问被拒绝，检查用户名和密码
- `ER_BAD_DB_ERROR`: 数据库不存在，运行 `npm run init-db` 创建数据库 
