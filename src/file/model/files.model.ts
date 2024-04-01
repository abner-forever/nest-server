import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'files', timestamps: true })
export class File extends Model<File> {
  @Column
  filename: string;

  @Column
  origin_name: string;

  @Column
  path: string;

  @CreatedAt
  @Column({ type: 'BIGINT' })
  register_time: number;

  @UpdatedAt
  @Column({ type: 'BIGINT' })
  update_time: number;

  @DeletedAt
  @Column({ type: 'BIGINT' })
  deleted_time?: number;
}
