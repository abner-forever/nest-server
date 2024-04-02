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

  @Cron('0 0 10 * * *')
  signIn() {
    this.logger.debug('掘金签到每天上午10点');
    jujinCheckIn();
  }
  // @Cron(CronExpression.EVERY_10_SECONDS) // 每10秒执行一次
  // handleCron() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT) // 在每个月的第1天凌晨1点触发任务。
  // @Cron(CronExpression.EVERY_10_SECONDS) // 每10秒执行一次
  async clearUploads() {
    this.logger.log('定时清理上传文件夹');
    const folderPath = './uploads'; // 上传文件夹路径
    let clearCount = 0;
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
              clearCount++;
              await fs.unlink(filePath); // 删除文件
              this.logger.log(`Deleted file: ${file}`);
            }
          }
        }
      };

      await traverseAndDeleteFiles(folderPath);
      if (!clearCount) {
        this.logger.log('没有可清理的文件');
      } else {
        this.logger.log('Cleanup completed.');
      }
    } catch (error) {
      this.logger.error('Error cleaning up uploaded files:', error);
    }
  }
}
