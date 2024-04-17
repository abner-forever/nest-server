import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
  NotAcceptableException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Response } from 'express';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie('key', 'value');
    return this.usersService.create(createUserDto);
  }

  @Get('userInfo')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserInfo(@Req() req) {
    const userData = await this.usersService.findById(req.user.userId);
    if (!userData) throw new NotAcceptableException('用户不存在');
    const userInfo = {
      ...userData?.toJSON(),
      expired: req?.user?.exp,
    };
    return new UserEntity(userInfo);
  }
  @Post('updateUserInfo')
  updateUserInfo(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
