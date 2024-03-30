import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { AuthService } from 'src/auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guard/auth.guard';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, //  守卫全局生效
    },
  ],
})
export class UsersModule {}
