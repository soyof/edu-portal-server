import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('user_infos')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 20, comment: '用户ID，主键，用于登录' })
    user_id!: string

  @Column({ type: 'varchar', length: 50, comment: '用户名' })
    username!: string

  @Column({ type: 'varchar', length: 100, comment: '密码，加密存储' })
    password!: string

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号码' })
    phone?: string

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '邮箱地址' })
    email?: string

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '实验室主页URL' })
    lab_homepage?: string

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '个人主页URL' })
    personal_homepage?: string

  @Column({ type: 'text', nullable: true, comment: '用户标签' })
    tags?: string

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '用户头像URL' })
    avatar?: string

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '用户证件照URL' })
    id_pic?: string

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '用户职称' })
    title?: string

  @Column({ type: 'varchar', length: 20, default: 'user', comment: '用户角色：admin, user等' })
    role!: string

  @Column({ type: 'tinyint', width: 1, default: 1, comment: '账号状态：1：正常，0：禁用' })
    status!: number

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
    created_times!: Date

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
    updated_times!: Date
}
