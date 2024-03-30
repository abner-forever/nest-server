import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
  }
  @Get(':id')
  @UseInterceptors(FileInterceptor('file'))
  getFile(@Param('id') id: string) {
    console.log('file', id);
    return null;
  }
}
