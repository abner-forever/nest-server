import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/database/models/user';

@Table({ tableName: 'tasks' })
export class Tasks extends Model<Tasks> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.TEXT })
  title: string;

  @Column(DataType.TEXT)
  description: string;

  @Column
  type: string;

  @Column({ defaultValue: 0 })
  spendTime: number;

  @Column({ defaultValue: 0 })
  status: number;

  @Column
  rate: number;

  @Column({ defaultValue: false })
  emailNotification: boolean;

  @Column({ defaultValue: null })
  notificationTime: string;

  @Column
  createTime: Date;
}
