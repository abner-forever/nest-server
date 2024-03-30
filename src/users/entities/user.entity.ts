import { Exclude } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';
import { Role } from 'src/enums/role.enum';
export class UserEntity {
  id: number;

  username: string;

  @Exclude()
  password: string;

  avator: string;

  sex: number;

  @IsPhoneNumber()
  phone: number;

  register_time: number;

  update_time: number;

  @Exclude()
  delete_time: number;

  roles: Role[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
