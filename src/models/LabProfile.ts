import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('lab_profile_infos')
export class LabProfile {
  @PrimaryGeneratedColumn({ comment: '简介ID' })
    id!: number

  @Column({ type: 'varchar', length: 20, comment: '简介类型: 5001(研究所简介), 5002(实验室环境简介)' })
    profile_type!: string

  @Column({ type: 'varchar', length: 255, comment: '简介标题' })
    title!: string

  @Column({ type: 'text', nullable: true, comment: '简介内容(中文)' })
    content?: string

  @Column({ type: 'text', nullable: true, comment: '简介内容(英文)' })
    content_en?: string

  @Column({ type: 'varchar', length: 20, comment: '创建人(用户编号)' })
    create_user_id!: string

  @Column({ type: 'varchar', length: 20, comment: '更新人(用户编号)' })
    update_user_id!: string

  @Column({ type: 'varchar', length: 2, default: '0', comment: '发布状态: 0(未发布), 1(已发布), 2(已下线)' })
    publish_status!: string

  @Column({ type: 'datetime', nullable: true, comment: '发布时间' })
    publish_times?: Date

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '发布人(用户编号)' })
    publish_user_id?: string

  @CreateDateColumn({ name: 'created_times', comment: '创建时间' })
    created_times!: Date

  @UpdateDateColumn({ name: 'updated_times', comment: '更新时间' })
    updated_times!: Date
}
