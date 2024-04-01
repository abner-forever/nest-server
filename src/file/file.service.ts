import { Injectable } from '@nestjs/common';
import { File } from './model/files.model';
import { InjectModel } from '@nestjs/sequelize';
import { isNumber } from 'class-validator';
import { Op } from 'sequelize';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File)
    private readonly fileModel: typeof File,
  ) {} // 注入 File 模型
  async create(data: Partial<File>): Promise<File> {
    return this.fileModel.create(data);
  }
  findOne(filename: string) {
    const options: Record<string, number | string> = {};
    isNumber(filename)
      ? (options.id = Number(filename))
      : (options.filename = filename);
    return this.fileModel.findOne({
      where: options,
    });
  }
  findDel() {
    return this.fileModel.findAll({
      where: {
        deleted_time: {
          [Op.not]: null, // 使用 Op.not 运算符表示不为空
        },
      },
    });
  }
  findAll() {
    return this.fileModel.findAll();
  }
}
