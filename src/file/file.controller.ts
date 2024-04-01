import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
  Logger,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorator/auth.decorator';
import { createReadStream } from 'fs';
import { extname, join } from 'path';
import { Response } from 'express';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
@Controller({ path: 'files' })
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly fileSrvice: FileService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file, @Req() req: Request) {
    console.log('uploadFile', file, req);
    const savedFile = await this.fileSrvice.create({
      filename: file.filename,
      path: file.path,
      origin_name: file.originalname,
    });
    return { url: `/api/files/${savedFile.filename}` };
  }

  @Public()
  @Get(':filename') // 在路径中不包含全局前缀
  @UseInterceptors(FileInterceptor('file'))
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    this.logger.log('获取文件:' + filename);
    const result = await this.fileSrvice.findOne(filename);
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
