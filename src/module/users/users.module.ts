import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../database/models/user';
import { AuthService } from 'src/module/auth/auth.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
