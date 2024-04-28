import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto, UpdateTaskDto } from 'src/database/dto/tasks.dto';
import Email from 'src/utils/email';
import { UsersService } from '../users/users.service';

@Controller('task')
export class TasksController {
  email: Email;
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {
    this.email = new Email();
  }
  @Get('/list')
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
  @Get('/listByMonth')
  getTodoListByMonth(
    @Req() req,
    @Query('year') year: string, // 请求年
    @Query('month') month: string, // 请求月份
    @Query('type') type: string, //任务类型
  ) {
    return this.tasksService.getTodoListByMonth({
      year,
      month,
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
      if (hasTask)
        throw new HttpException(
          '今日已打卡, 请勿重复提交',
          HttpStatus.BAD_REQUEST,
        );
    }
    const { username, email } = await this.usersService.findById(userId);
    return this.tasksService.create({
      ...tasks,
      userId,
      email,
      username,
    });
  }
  @Post('update')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateTasks(@Req() req, @Body() tasks: UpdateTaskDto) {
    try {
      return this.tasksService.update({
        ...tasks,
        userId: req.user.userId,
      });
    } catch (error) {
      console.error('error', error);
    }
  }
  @Delete('delete')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteTask(@Body() tasks: UpdateTaskDto) {
    try {
      return this.tasksService.delete(tasks.id);
    } catch (error) {
      console.error('error', error);
    }
  }
}
