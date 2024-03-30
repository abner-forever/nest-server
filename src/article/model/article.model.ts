import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/model/user.model';
@Table({ tableName: 'article', timestamps: true })
export class Article extends Model<Article> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'author_id' })
  author_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  title: string;

  @Column
  description: string;

  @Column(DataType.TEXT) // 使用 TEXT 类型
  content: string;

  @Column
  type: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  view_count: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  like_count: number;

  @Column
  cover: string;

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
