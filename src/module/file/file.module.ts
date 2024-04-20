import { Module } from '@nestjs/common';
import { File } from '../../database/models/files';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
