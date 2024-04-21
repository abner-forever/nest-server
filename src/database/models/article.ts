import {
  Column,
  Model,
  Table,
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
  authorId: number;

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
  viewCount: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  likeCount: number;

  @Column
  cover: string;
}
