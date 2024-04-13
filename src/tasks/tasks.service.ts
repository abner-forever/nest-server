import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { jujinCheckIn } from './juejinSign';
import { FileService } from 'src/file/file.service';
import { promises as fs } from 'fs';
import { join } from 'path';
import nodeMailer from 'nodemailer';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

@Injectable()
export class TasksService {
  emailConfig: {
    cookie: string;
    user: string;
    from: string;
    to: string[];
    pass: string;
  };
  constructor(private readonly fileService: FileService) {
    this.emailConfig = {
      cookie: process.env.JUEJIN_TOEKN,
      user: process.env.EMAIL_ADDRESS,
      from: process.env.EMAIL_ADDRESS,
      to: [process.env.EMAIL_ADDRESS],
      pass: process.env.EMAIL_ADDRESS_PASS,
    };
  } // 注入 B 模块中的服务

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 0 10 * * *') // 掘金签到每天上午10点
  // @Cron(CronExpression.EVERY_10_SECONDS) // 每10秒执行一次
  signIn() {
    jujinCheckIn(this.emailConfig);
  }

  // @Cron('0 0 20 * * *') // 每晚8点提醒锻炼打卡
  @Cron(CronExpression.EVERY_10_MINUTES) // test 每10分钟执行一次
  exerCise() {
    const today = dayjs().format('YYYY-MM-DD dddd');
    // 问卷地址
    const questionUrl = 'https://f.wps.cn/g/hpDgagG6';
    this.sendEmail({
      title: '今天该锻炼啦',
      content: `<div>
      <p class="title">今天是${today}</p>
      <div class="desc">
          <p>请开始你的锻炼</p>
          <p>运动结束后可以填写以下问卷进行打卡</p>
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
  </style>`,
    });
    console.log('发送打卡邮件', dayjs().format('YYYY-MM-DD dddd hh:mm:ss'));
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT) // 在每个月的第1天凌晨1点触发任务。
  async clearUploads() {
    this.logger.log('定时清理上传文件夹');
    const folderPath = './uploads';
    this.clearCache(folderPath);
  }
  @Cron(CronExpression.EVERY_WEEKEND) // 每周末清理一次
  async clearTemp() {
    this.logger.log('定时临时上传文件');
    const folderPath = './uploads/temp';
    this.clearCache(folderPath);
  }
  async clearCache(folderPath: string) {
    try {
      // 查询数据库中的文件记录
      const filesInDatabase = await this.fileService.findAll();
      // 递归遍历文件夹中的所有文件和子文件夹
      const traverseAndDeleteFiles = async (folderPath: string) => {
        const filesInFolder = await fs.readdir(folderPath);
        for (const file of filesInFolder) {
          const filePath = join(folderPath, file);
          const fileStats = await fs.stat(filePath);
          if (fileStats.isDirectory()) {
            // 如果是文件夹，则递归遍历
            await traverseAndDeleteFiles(filePath);
          } else {
            // 如果是文件，则检查是否存在于数据库中，若不存在则删除
            const fileExistsInDatabase = filesInDatabase.some(
              (dbFile) => dbFile.filename === file,
            );
            if (!fileExistsInDatabase) {
              await fs.unlink(filePath); // 删除文件
              this.logger.log(`Deleted file: ${file}`);
            }
          }
        }
      };
      await traverseAndDeleteFiles(folderPath);
    } catch (error) {
      this.logger.error('Error cleaning up uploaded files:', error);
    }
  }

  /** 邮件发送 */
  sendEmail({ title, content }) {
    const transporter = nodeMailer.createTransport({
      service: 'qq',
      auth: { user: this.emailConfig.user, pass: this.emailConfig.pass },
    });
    const send = ({ user, title, content }) => {
      return new Promise((resolve) => {
        transporter.sendMail(
          {
            from: this.emailConfig.from,
            to: user,
            subject: title,
            html: content,
          },
          (err) => {
            if (err) {
              console.log('邮件发送失败', err);
              resolve(new Error(`邮件发送失败:${err.name}  ${err.message}`));
            }
          },
        );
        resolve(null);
      });
    };
    this.emailConfig.to.forEach((item) => {
      send({ user: item, title, content });
    });
  }
}
