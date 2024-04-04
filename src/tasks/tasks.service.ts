import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { jujinCheckIn } from './juejinSign';
import { FileService } from 'src/file/file.service';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class TasksService {
  constructor(private readonly fileService: FileService) {} // 注入 B 模块中的服务

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 0 10 * * *') // 掘金签到每天上午10点
  signIn() {
    jujinCheckIn();
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT) // 在每个月的第1天凌晨1点触发任务。
  async clearUploads() {
    this.logger.log('定时清理上传文件夹');
    const folderPath = './uploads';
    this.clearCache(folderPath);
  }
  @Cron(CronExpression.EVERY_WEEKEND) // 每周末清理一次
  // @Cron(CronExpression.EVERY_10_SECONDS) // 每10秒执行一次
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
}
