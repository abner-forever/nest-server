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

@Table({ tableName: 'tasks', timestamps: true })
export class Tasks extends Model<Tasks> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.TEXT })
  title: string;

  @Column(DataType.TEXT)
  description: string;

  @Column
  type: string;

  @Column({ defaultValue: 0 })
  spend_time: number;

  @Column({ defaultValue: 0 })
  status: number;

  @Column
  rate: number;

  @Column({ defaultValue: false })
  email_notification: boolean;

  @Column({ defaultValue: null })
  notification_time: string;

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
