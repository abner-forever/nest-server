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

  @Column
  type: string;

  @CreatedAt
  @Column
  register_time: Date;

  @UpdatedAt
  @Column
  update_time: Date;

  @DeletedAt
  @Column
  deleted_time: Date;
}
