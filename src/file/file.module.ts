import { Module } from '@nestjs/common';
import { File } from './model/files.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileController } from './file.controller';
import { FileService } from './file.service';
@Module({
  imports: [SequelizeModule.forFeature([File])], // 注册 File 模型
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
