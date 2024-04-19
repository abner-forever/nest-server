import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/auth.decorator';
import { LoginUserDto, SendEmailParams } from 'src/users/dto/create-user.dto';
import dayjs from 'dayjs';
import { authcodeEmail } from 'src/template/email';
import Email from 'src/utils/email';
import { isNotEmpty } from 'class-validator';

@Controller()
export class AuthController {
  email: Email;
  constructor(private authService: AuthService) {
    this.email = new Email();
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginParams: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, authCode, password, loginType } = loginParams;
    let result: { token: any };
    if (loginType === 1 || isNotEmpty(authCode)) {
      result = await this.authService.login({
        email,
        authCode,
      });
    } else {
      result = await this.authService.signIn({
        email,
        password,
      });
    }
    response.cookie('user-token', result.token, {
      maxAge: 30 * 1000 * 60 * 60 * 24,
    });
    return result;
  }

  @Public()
  @Post('authCode') // 发送验证码
  authCode(@Body() { email }: SendEmailParams) {
    const code = this.authService.generateVerificationCode();
    this.authService.storeVerificationCode(email, code);
    const today = dayjs().format('YYYY-MM-DD dddd');
    // 问卷地址
    const options = {
      date: today,
      code: String(code),
    };
    const message = authcodeEmail(options);
    // 发送邮件的对象
    this.email.sendEmail({
      toEmail: email,
      title: '【Abner的博客】',
      message,
    });
    const now = new Date();
    const oneMinuteLater = new Date(now.getTime() + 60000); // 60000 毫秒 = 1 分钟
    return {
      expiredTime: oneMinuteLater,
    };
  }
}
