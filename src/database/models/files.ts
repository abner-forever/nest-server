import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'files', timestamps: true })
export class File extends Model<File> {
  @Column
  filename: string;

  @Column
  originName: string;

  @Column
  path: string;

  @Column
  type: string;
}
