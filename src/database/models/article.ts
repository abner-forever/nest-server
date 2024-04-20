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
import { User } from 'src/database/models/user';

@Table({ tableName: 'article', timestamps: true, paranoid: false })
export class Article extends Model<Article> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'author_id' })
  author_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.TEXT, defaultValue: '未命名文章' })
  title: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.TEXT)
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
  @Column
  create_time: Date;

  @UpdatedAt
  @Column
  update_time: Date;

  @DeletedAt
  @Column
  delete_time: Date;
}
