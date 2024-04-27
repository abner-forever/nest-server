import { IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
class EmailDto {
  @ApiProperty()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;
}
export class CreateUserDto extends EmailDto {}

export class LoginUserDto extends EmailDto {
  @ApiProperty()
  authCode?: string;
  /**
   * 1- 验证码登录
   * 2- 密码登录
   */
  @ApiProperty()
  loginType?: 1 | 2;
  @ApiProperty()
  /** 密码 */
  password?: string;
}

export class SendEmailParams extends EmailDto {}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  username?: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  sex?: number;
  @ApiProperty()
  avator?: string;
  @ApiProperty({
    description: '个性签名',
  })
  sign?: string;
}
