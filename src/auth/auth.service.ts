import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from 'src/utils';
import { salt } from './constants';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    let user = await this.usersService.findByName(username);
    if (!user) {
      // 用户不存在直接注册
      await this.usersService.create({
        username: username,
        password: hashPassword(pass, salt),
      });
      user = await this.usersService.findByName(username);
    } else {
      if (user?.password !== hashPassword(pass, salt)) {
        throw new UnauthorizedException({ message: '用户名或密码错误' });
      }
    }
    const payload = { userId: user.id, username: user.username };
    return {
      ...payload,
      token: await this.jwtService.signAsync(payload),
    };
  }
}
