import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorator/auth.decorator';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { FileService } from './file.service';
import * as fs from 'fs';
@Controller({ path: 'files' })
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Post('upload/head')
  @UseInterceptors(FileInterceptor('file', { dest: './uploads/temp' }))
  async uploadFile(@UploadedFile() file) {
    console.log('uploadFile', file.originalname);

    // 检查文件是否已经存在于数据库中
    const existingFile = await this.fileService.findByOriginName(
      file.originalname,
    );
    if (existingFile) {
      await fs.promises.unlink(file.path); // 删除临时文件
      // 如果文件已存在于数据库中，则返回已有文件的地址
      return Promise.resolve({
        url: `/api/files/${existingFile.filename}`,
        message: 'File already exists',
      });
    }
    return this.fileService.saveUploadedFile(file);
  }
  // async uploadFile(@UploadedFile() file) {
  //   // 检查文件是否已经存在于数据库中
  //   const existingFile = await this.fileService.findByOriginName(
  //     file.originalname,
  //   );
  //   console.log('file', file.originalname, existingFile);
  //   if (existingFile) {
  //     // 如果文件已存在，则直接返回已有文件的地址
  //     return { url: `/api/files/${existingFile.filename}` };
  //   }
  //   console.log('继续执行？', existingFile);
  //   // 使用Jimp来处理图像
  //   const image = await Jimp.read(file.path);
  //   // 裁剪图像为200x200的正方形
  //   image.cover(200, 200);
  //   // 将裁剪后的图像覆盖原始文件
  //   await image.writeAsync(file.path);
  //   const savedFile = await this.fileService.create({
  //     filename: file.filename,
  //     path: file.path,
  //     origin_name: file.originalname,
  //   });
  //   return { url: `/api/files/${savedFile.filename}` };
  // }

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
