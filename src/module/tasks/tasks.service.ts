import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { jujinCheckIn } from './juejinSign';
import { FileService } from 'src/module/file/file.service';
import { promises as fs } from 'fs';
import { join } from 'path';
import nodeMailer from 'nodemailer';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { FindOptions } from 'sequelize';
import { User } from 'src/database/models/user';
import { Tasks } from 'src/database/models/tasks';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTasksDto, UpdateTaskDto } from 'src/database/dto/tasks.dto';
import { exerciseEmail } from 'src/template/email';
import { Op } from 'sequelize';

dayjs.locale('zh-cn');

export const workoutsList = {
  0: ['瑜伽', '健身操', '哑铃训练'],
  1: ['跳绳', '仰卧起坐', '俯卧撑'],
  2: ['晨间拉伸', '椭圆机训练', '深蹲'],
  3: ['动感单车', '平板支撑', '引体向上'],
  4: ['拳击训练', '波比跳', '舞蹈课程'],
  5: ['踢踏舞', '游泳', '户外跑步'],
  6: ['拉伸放松', '拳击有氧操', '自行车训练'],
};
@Injectable()
export class TasksService {
  emailConfig: {
    cookie: string;
    user: string;
    from: string;
    to: string[];
    pass: string;
  };
  constructor(
    private readonly fileService: FileService,
    @InjectModel(Tasks)
    private readonly tasksModel: typeof Tasks,
  ) {
    this.emailConfig = {
      cookie: process.env.JUEJIN_TOEKN,
      user: process.env.EMAIL_ADDRESS,
      from: process.env.EMAIL_ADDRESS,
      to: [process.env.EMAIL_ADDRESS],
      pass: process.env.EMAIL_ADDRESS_PASS,
    };
  }
  private readonly logger = new Logger(TasksService.name);

  async getTodoList({ pageNum = 1, pageSize = 10, userId, type }) {
    const offset = (pageNum - 1) * pageSize; // 计算偏移量

    // 构建查询选项
    const options: FindOptions = {
      offset,
      limit: pageSize,
      include: [], // 添加 include 选项用于关联查询
    };

    if (userId) {
      options.where = { user_id: userId, type: type || null };
    }
    // 关联查询用户表，并获取关联的用户名信息
    options.include = [{ model: User, attributes: ['username'] }];
    const { count, rows } = await this.tasksModel.findAndCountAll(options);

    const totalPages = Math.ceil(count / pageSize); // 总页数
    const hasNextPage = pageNum < totalPages; // 是否有下一页
    // 将嵌套结构展平
    const list = rows.map((article) => ({
      ...article.toJSON(),
      author: article.user.username, // 将作者信息从嵌套结构中提取出来
      user: undefined,
    }));
    return { list, pageNum, pageSize, totalPages, hasNextPage, totals: count }; // 返回带有页码相关信息的响应数据
  }
  async getTask({ type, userId }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 将时间设置为今天的开始时间
    const result = await this.tasksModel.findOne({
      where: {
        type: type,
        create_time: {
          [Op.gte]: today, // 使用大于或等于操作符，表示 create_time 大于或等于今天的开始时间
        },
      },
      include: [
        {
          model: User,
          where: {
            id: userId, // 假设 userId 是你要限制的用户的 ID
          },
          attributes: ['username'],
        },
      ],
    });
    return result;
  }
  // 创建任务
  async create(createTasksDto: CreateTasksDto) {
    await this.tasksModel.create(createTasksDto);
    return true;
  }
  // 更新任务
  async update(updateTaskDto: UpdateTaskDto) {
    await this.tasksModel.update(updateTaskDto, {
      where: {
        // 更新条件，例如：id
        id: updateTaskDto.id,
      },
    });
    return null;
  }

  async delete(id: number) {
    await this.tasksModel.destroy({
      where: {
        id,
      },
    });
  }

  @Cron('0 0 10 * * *') // 掘金签到每天上午10点
  // @Cron(CronExpression.EVERY_10_SECONDS) // 每10秒执行一次
  signIn() {
    jujinCheckIn(this.emailConfig);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8PM) // 每晚8点提醒锻炼打卡
  exerCise() {
    const today = dayjs().format('YYYY-MM-DD dddd');
    const dayOfWeek = dayjs().day();
    const workouts = workoutsList[dayOfWeek];
    console.log('workouts', workouts);
    // 问卷地址
    const questionUrl = 'https://f.wps.cn/g/hpDgagG6';
    // 发送邮件的对象
    const users = [process.env.EMAIL_ADDRESS, process.env.EMAIL_ADDRESS_JIA];
    const content = exerciseEmail({ today, questionUrl, workouts });
    this.sendEmail({
      users,
      title: '今天该锻炼啦',
      content,
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
  sendEmail({ users, title, content }) {
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
    users.forEach((item) => {
      send({ user: item, title, content });
    });
  }
}