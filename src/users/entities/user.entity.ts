import { Exclude } from 'class-transformer';
import { IsEmail, IsPhoneNumber } from 'class-validator';
export class UserEntity {
  id: number;

  username: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @Exclude()
  password: string;

  avator: string;

  sex: number;

  @IsPhoneNumber()
  phone: string;

  register_time: Date;

  update_time: Date;

  @Exclude()
  delete_time: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
