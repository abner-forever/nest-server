import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from 'src/utils';
import { salt } from './constants';
import { LoginUserDto } from 'src/database/dto/users.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // 邮箱登录
  async login({ email, authCode }): Promise<any> {
    const passed = await this.verifyCode(email, authCode);
    if (!passed) {
      throw new UnauthorizedException({ message: '邮箱或验证码错误' });
    }

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      // 用户不存在直接注册
      await this.usersService.create({
        email,
      });
      user = await this.usersService.findByEmail(email);
    }

    const payload = { userId: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    this.redis.del(`authCode_${email}`);
    return {
      ...payload,
      token,
    };
  }

  // 密码登录
  async signIn({ email, password }: LoginUserDto): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // 用户不存在直接注册
      throw new UnauthorizedException({
        message: '用户不存在请使用邮箱验证码登录',
      });
    } else {
      if (user?.password !== hashPassword(password, salt)) {
        throw new UnauthorizedException({ message: '用户名或密码错误' });
      }
    }
    const payload = { userId: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    // this.generateToken({ userId: user.id, token });
    return {
      ...payload,
      token,
    };
  }
  generateVerificationCode(email: string) {
    // 生成6位随机数
    const code = String(Math.floor(100000 + Math.random() * 900000));
    // redis缓存10分钟
    this.redis.set(`authCode_${email}`, code, 'EX', 60 * 10);
    return code;
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    // 检查验证码是否匹配并且在10分钟内有效
    const cacheCode = await this.redis.get(`authCode_${email}`);
    if (cacheCode && cacheCode === code) {
      return true;
    }
    return false;
  }
}
