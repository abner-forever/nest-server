import { Exclude } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';
export class UserEntity {
  id: number;

  username: string;

  @Exclude()
  password: string;

  avator: string;

  sex: number;

  @IsPhoneNumber()
  phone: string;

  register_time: Date;

  update_time: Date;

  @Exclude()
  delete_time: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
