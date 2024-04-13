import { PartialType } from '@nestjs/mapped-types';
import { CreateTasksDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTasksDto) {
  id: number;
}
