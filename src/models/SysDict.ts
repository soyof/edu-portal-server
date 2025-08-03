import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('sys_dict')
export class SysDict {
  @PrimaryColumn({ type: 'varchar', length: 36, comment: '字典ID' })
    dict_id!: string

  @Column({ type: 'varchar', length: 100, comment: '字典类型编码' })
    dict_type!: string

  @Column({ type: 'varchar', length: 100, comment: '字典类型名称' })
    dict_type_name!: string

  @Column({ type: 'varchar', length: 200, comment: '字典值(中文)' })
    dict_value!: string

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '字典值(英文)' })
    dict_value_en?: string

  @Column({ type: 'int', default: 0, comment: '排序字段' })
    sort_order!: number

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '备注' })
    remark?: string

  @Column({ type: 'tinyint', width: 1, default: 1, comment: '状态(1:启用,0:禁用)' })
    status!: number

  @Column({ type: 'varchar', length: 20, comment: '创建人(用户编号)' })
    create_user_id!: string

  @Column({ type: 'varchar', length: 20, comment: '更新人(用户编号)' })
    update_user_id!: string

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
    created_times!: Date

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
    updated_times!: Date
}
