import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Public } from './decorator/auth.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    response.cookie('user-token', result.token);
    return result;
  }
}
