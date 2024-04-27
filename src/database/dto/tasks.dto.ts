import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTasksDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  /**
   * 0- 未完成
   * 1- 已完成
   */
  @ApiProperty()
  status: number;
  userId: number;
  @ApiProperty()
  spendTime: number;
  @ApiProperty()
  type: string;
  @ApiProperty()
  rate: number;
  /** 是否邮件通知 */
  emailNotification: boolean;
  /** 通知时间 */
  notificationTime?: string;
  email?: string;
  username?: string;
}

export class UpdateTaskDto extends PartialType(CreateTasksDto) {
  id: number;
}
