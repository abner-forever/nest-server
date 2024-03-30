import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Response } from 'express';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { convertKeysToCamelCase } from 'src/utils';
// import { Public } from 'src/decorator/auth.decorator';

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
  @Get('userinfo')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserInfo(@Req() req): Promise<UserEntity> {
    const userData = await this.usersService.findById(req.user.id);
    const userInfo = convertKeysToCamelCase({
      ...userData.toJSON(),
      expired: req?.user?.exp,
    });
    return new UserEntity(userInfo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
