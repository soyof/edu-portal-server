import { DataSource, DataSourceOptions } from 'typeorm'
import path from 'path'

// 环境变量已在app.ts中加载，这里不需要重复加载
// import dotenv from 'dotenv';
// dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE
} = process.env

// 数据库配置选项
export const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT ? parseInt(DB_PORT) : 3306,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true, // 自动同步实体到数据库，生产环境应设为false
  cache: false, // 完全禁用缓存
  logging: false,
  entities: [path.join(__dirname, '../models/**/*.{js,ts}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{js,ts}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{js,ts}')],
  // 连接池配置
  poolSize: 10, // 连接池中最大连接数
  connectTimeout: 30000, // 30秒连接超时
  extra: {
    // MySQL连接池配置
    connectionLimit: 10, // 最大连接数
    queueLimit: 0, // 队列中可等待的连接数，0表示不限制
    waitForConnections: true, // 是否等待连接
    idleTimeout: 60000, // 空闲连接超时时间(ms)
    maxIdle: 10 // 最大空闲连接数
  }
}

// 单例模式数据库连接实例
class DatabaseConnection {
  private static instance: DatabaseConnection
  private dataSource: DataSource | null = null

  private constructor() {
    // 私有构造函数，防止外部直接创建实例
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  public async getDataSource(): Promise<DataSource> {
    try {
      if (!this.dataSource || !this.dataSource.isInitialized) {
        console.log('[数据库] 创建新的数据源实例...')

        this.dataSource = new DataSource(dbConfig)
        await this.dataSource.initialize()
        console.log('[数据库] 连接池已初始化')
      }

      return this.dataSource
    } catch (error: any) {
      console.error('[数据库] 连接失败:', error.message)
      console.error('[数据库] 错误详情:', error)

      // 检查常见的数据库连接错误
      if (error.code === 'ECONNREFUSED') {
        throw new Error('无法连接到数据库服务器，请确认数据库服务是否启动')
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        throw new Error('数据库访问被拒绝，请检查用户名和密码')
      } else if (error.code === 'ER_BAD_DB_ERROR') {
        throw new Error(`数据库 "${DB_DATABASE}" 不存在，请先创建数据库`)
      }

      throw error
    }
  }

  public async closeDataSource(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy()
      this.dataSource = null
      console.log('[数据库] 连接池已关闭')
    }
  }
}

// 导出数据库连接单例
export const dbConnection = DatabaseConnection.getInstance()

// 获取数据库连接 - 兼容旧接口
export const getConnection = async(): Promise<DataSource> => {
  return dbConnection.getDataSource()
}

// 关闭数据库连接 - 应用程序关闭时调用
export const closeConnection = async(dataSource?: DataSource): Promise<void> => {
  return dbConnection.closeDataSource()
}
