import { Module } from '@nestjs/common';
import { FileModule } from 'src/module/file/file.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tasks } from '../../database/models/tasks';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [FileModule, UsersModule, SequelizeModule.forFeature([Tasks])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TaskModule {}
