import { Body, Controller, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Public } from 'src/decorator/auth.decorator';
import dayjs from 'dayjs';

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

    this.tasksService.sendEmail({ title: params.title, content });
  }
}
