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
import { Public } from 'src/decorator/auth.decorator';
import dayjs from 'dayjs';
import { CreateTasksDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Post('email')
  @Public()
  sendEmail(@Body() params: Record<string, string>) {
    const today = dayjs().format('YYYY-MM-DD dddd');
    // 问卷地址
    const questionUrl = 'https://f.wps.cn/g/hpDgagG6';
    const content = `<div>
        <p class="title">今天是${today}</p>
        <div class="desc">
            <p>请开始你的锻炼</p>
            <p>运动结束后可以填写以下问卷进行打卡</p>
            <p>${params.content}</p>
            <a href=${questionUrl}>去打卡吧</a>
        </div>
    </div>
    <style type="text/css" media="all">
        .title{
            font-size: 24px;
            line-height: 40px;
            font-weight: 600;
        }
        .desc{
            margin-left: 10px;
            margin-top: 20px
        }
    </style>`;

    this.tasksService.sendEmail({
      users: [process.env.EMAIL_ADDRESS],
      title: params.title,
      content,
    });
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
