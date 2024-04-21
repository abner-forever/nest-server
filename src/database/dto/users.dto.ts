import { IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

class EmailDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;
}
export class CreateUserDto extends EmailDto {}

export class LoginUserDto extends EmailDto {
  authCode?: string;
  /**
   * 1- 验证码登录
   * 2- 密码登录
   */
  loginType?: 1 | 2;
  /** 密码 */
  password?: string;
}

export class SendEmailParams extends EmailDto {}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  username?: string;
  phone?: string;
  sex?: number;
  avator?: string;
}
