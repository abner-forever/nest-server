import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { TasksService } from './tasks.service';
@Module({
  imports: [FileModule],
  controllers: [],
  providers: [TasksService],
})
export class TaskModule {}
