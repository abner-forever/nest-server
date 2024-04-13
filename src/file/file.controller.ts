import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorator/auth.decorator';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { FileService } from './file.service';
import fs from 'fs';

const tempDir = join(__dirname, '../uploads/temp'); // 临时文件夹
@Controller({ path: 'files' })
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly fileService: FileService) {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  }

  @Public()
  @Post('upload/:type')
  @UseInterceptors(FileInterceptor('file', { dest: tempDir }))
  async uploadFile(@UploadedFile() file, @Param('type') type: string) {
    if (!file) {
      throw new NotAcceptableException('file not upload');
    }
    // 检查文件是否已经存在于数据库中
    const existingFile = await this.fileService.findByOriginName(
      file.originalname || file.name,
    );
    if (existingFile) {
      await fs.promises.unlink(file.path); // 删除临时文件
      // 如果文件已存在于数据库中，则返回已有文件的地址
      return Promise.resolve({
        url: `/api/files/${existingFile.filename}`,
        message: 'File already exists',
      });
    }
    return this.fileService.saveUploadedFile(file, type);
  }

  @Public()
  @Get(':filename') // 在路径中不包含全局前缀
  @UseInterceptors(FileInterceptor('file'))
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    this.logger.log('获取文件:' + filename);
    const result = await this.fileService.findOne(filename);
    if (!result) {
      res.status(500).send('file not found');
    }
    const filePath = result.toJSON().path;
    const file = createReadStream(join(process.cwd(), filePath));
    file.on('error', (error) => {
      console.error('Error reading file:', error.message);
      res.status(500).send('file not found');
    });
    file.pipe(res);
  }
}
