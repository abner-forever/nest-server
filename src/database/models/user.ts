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
  email: string;

  @Column
  password: string;

  @Column
  avator: string;

  @Column
  sex: number;

  @Column
  phone: string;

  @CreatedAt
  @Column
  register_time: Date;

  @UpdatedAt
  @Column
  update_time: Date;

  @DeletedAt
  @Column
  delete_time: Date;
}
