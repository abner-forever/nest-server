import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './model/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.userModel.create(createUserDto);
    return null;
  }

  findAll() {
    return this.userModel.findAll();
  }
  findById(id: number) {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }
  findByName(username: string) {
    return this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userModel.update(updateUserDto, {
      where: {
        id,
      },
    });
    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
