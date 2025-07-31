# 教育系统后端服务

基于Koa和TypeScript构建的RESTful API服务，使用MySQL作为数据库，实现用户认证和授权功能。

## 技术栈

- **Node.js**: JavaScript运行时环境
- **Koa**: 轻量级Web框架
- **TypeScript**: 类型安全的JavaScript超集
- **MySQL**: 关系型数据库
- **TypeORM**: 对象关系映射(ORM)库
- **JWT**: 用于身份验证的JSON Web Token

## 功能特性

- 用户注册和登录
- 基于JWT的身份验证
- 用户角色和权限控制
- RESTful API设计
- 错误处理和日志记录

## 项目结构

```
edu-server/
├── src/                      # 源代码目录
│   ├── config/               # 配置文件
│   ├── controllers/          # 控制器
│   ├── middlewares/          # 中间件
│   ├── models/               # 数据模型
│   ├── routes/               # 路由定义
│   ├── services/             # 业务逻辑服务
│   ├── utils/                # 工具函数
│   └── app.ts                # 应用入口文件
├── .env                      # 环境变量
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript配置
└── README.md                 # 项目文档
```

## 安装与运行

### 前提条件

- Node.js (v14+)
- MySQL (v8+)

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建一个`.env`文件，参考示例：

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=edu_system
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

### 创建数据库

```sql
CREATE DATABASE edu_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 生产模式运行

```bash
npm start
```

## API文档

### 用户认证

#### 注册新用户

```
POST /api/users/register
```

请求体:

```json
{
  "username": "example",
  "email": "example@example.com",
  "password": "password123",
  "phone": "13800138000"
}
```

#### 用户登录

```
POST /api/users/login
```

请求体:

```json
{
  "username": "example",
  "password": "password123"
}
```

响应:

```json
{
  "status": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "example",
      "email": "example@example.com",
      "role": "user"
    }
  }
}
```

### 用户管理

#### 获取当前用户信息

```
GET /api/users/me
```

需要认证: 是

#### 获取所有用户 (仅管理员)

```
GET /api/users
```

需要认证: 是
需要权限: admin

#### 更新用户信息

```
PUT /api/users/:id
```

需要认证: 是

请求体:

```json
{
  "email": "newemail@example.com",
  "phone": "13900139000"
}
```

#### 删除用户 (仅管理员)

```
DELETE /api/users/:id
```

需要认证: 是
需要权限: admin

## 许可证

MIT 
