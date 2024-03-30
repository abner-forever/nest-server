import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
@Table({ tableName: 'user', timestamps: true })
export class User extends Model<User> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  avator: string;

  @Column
  sex: number;

  @Column
  phone: number;

  @CreatedAt
  @Column({ type: 'BIGINT' }) // 将日期时间存储为时间戳
  register_time: number;

  @UpdatedAt
  @Column({ type: 'BIGINT' }) // 将日期时间存储为时间戳
  update_time: number;

  @DeletedAt
  @Column({ type: 'BIGINT' }) // 将日期时间存储为时间戳
  delete_time: number;
}
