import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
@Module({
  imports: [FileModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TaskModule {}
