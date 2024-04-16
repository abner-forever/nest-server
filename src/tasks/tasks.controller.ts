import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import Email from 'src/utils/email';

@Controller('task')
export class TasksController {
  email: Email;
  constructor(private readonly tasksService: TasksService) {
    this.email = new Email();
  }
  @Get('/todolist')
  getTodoList(
    @Req() req,
    @Query('pageNum') pageNum: number = 1, // 默认页码为 1
    @Query('pageSize') pageSize: number = 10, // 默认每页数量为 10
  ) {
    return this.tasksService.getTodoList({
      pageNum: +pageNum,
      pageSize: +pageSize,
      userId: req.user.userId,
    });
  }
  @Post('add')
  @UseInterceptors(ClassSerializerInterceptor)
  async addTasks(@Req() req, @Body() tasks: CreateTasksDto) {
    return this.tasksService.create({
      ...tasks,
      user_id: req.user.userId,
    });
  }
  @Post('update')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateTasks(@Req() req, @Body() tasks: UpdateTaskDto) {
    try {
      return this.tasksService.update({
        ...tasks,
        user_id: req.user.userId,
      });
    } catch (error) {
      console.error('error', error);
    }
  }
  @Post('delete')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteTask(@Body() tasks: UpdateTaskDto) {
    try {
      return this.tasksService.delete(tasks.id);
    } catch (error) {
      console.error('error', error);
    }
  }
}
