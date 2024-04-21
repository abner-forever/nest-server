import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from 'src/utils';
import { salt } from './constants';
import { LoginUserDto } from 'src/database/dto/users.dto';
// import { RedisService } from '@liaoliaots/nestjs-redis';
// import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private readonly verificationCodes = new Map<
    string,
    { code: string; timestamp: number }
  >();
  // private readonly redis: Redis;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    // private readonly redisService: RedisService,
  ) {
    // this.redis = this.redisService.getClient();
  }

  // 邮箱登录
  async login({ email, authCode }): Promise<any> {
    const passed = this.verifyCode(email, authCode);
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
    // this.generateToken({ userId: user.id, token });
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
  generateVerificationCode() {
    // 生成随机的验证码
    return String(Math.floor(100000 + Math.random() * 900000)); // 生成6位随机数
  }
  storeVerificationCode(email: string, code: string): void {
    // 存储验证码和生成时间戳
    const timestamp = Date.now();
    this.verificationCodes.set(email, { code, timestamp });
  }

  verifyCode(email: string, code: string): boolean {
    // 检查验证码是否匹配并且在10分钟内有效
    const storedCode = this.verificationCodes.get(email);
    if (storedCode?.code && storedCode.code === code) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - storedCode.timestamp;
      const tenMinutesInMillis = 10 * 60 * 1000;
      return elapsedTime <= tenMinutesInMillis;
    }
    return false;
  }

  // //token缓存
  // async generateToken({ token, userId }): Promise<string> {
  //   await this.redis.set(userId, token, 'EX', 60 * 60 * 24); // 设置过期时间为一天
  //   return token;
  // }
  // async verifyToken(userId: string): Promise<string | null> {
  //   const token = await this.redis.get(userId);
  //   return token;
  // }
}
