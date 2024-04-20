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
import { CreateTasksDto, UpdateTaskDto } from 'src/database/dto/tasks.dto';
import { convertObjectKeysToSnakeCase } from 'src/utils';
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
    @Query('type') type?: string, // 任务类型
  ) {
    return this.tasksService.getTodoList({
      pageNum: +pageNum,
      pageSize: +pageSize,
      type,
      userId: req.user.userId,
    });
  }
  @Post('add')
  @UseInterceptors(ClassSerializerInterceptor)
  async addTasks(@Req() req, @Body() tasks: CreateTasksDto) {
    const { userId } = req.user;
    if (tasks.type === 'exercise') {
      const hasTask = await this.tasksService.getTask({
        type: tasks.type,
        userId,
      });
      if (hasTask) return Promise.reject(Error('今日已打卡, 请勿重复提交'));
    }
    return this.tasksService.create({
      ...convertObjectKeysToSnakeCase({ ...tasks, userId }),
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
