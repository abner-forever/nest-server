import { BadRequestException, Injectable } from '@nestjs/common';
import { File } from '../../database/models/files';
import { InjectModel } from '@nestjs/sequelize';
import { isNumber } from 'class-validator';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

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
  findByOriginName(originalname: string) {
    return this.fileModel.findOne({
      where: {
        origin_name: originalname,
      },
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
  saveUploadedFile(file, type: string) {
    // 创建可读流，读取文件内容
    const readStream = fs.createReadStream(file.path);
    readStream.setEncoding('utf-8');
    // 处理文件流，这里可以根据需要进行处理
    readStream.on('data', () => {
      // 空的回调函数，仅用于确保请求不会超时
    });

    // 监听 'error' 事件，处理读取文件时出现的错误
    readStream.on('error', (error) => {
      console.error('Error reading file:', error);
      throw new BadRequestException('Error reading file');
    });

    return new Promise((resolve, reject) => {
      readStream.on('end', async () => {
        // 保存文件到指定目录
        const destinationDir = path.join(process.cwd(), `./uploads/${type}`);
        const fileExtension = path.extname(file.originalname); // 获取文件后缀名
        const filename = `${file.filename}${fileExtension}`;
        const destination = path.join(destinationDir, filename);
        try {
          await fs.promises.mkdir(destinationDir, { recursive: true }); // 递归创建目录
          await fs.promises.copyFile(file.path, destination);

          // 删除临时文件
          await fs.promises.unlink(file.path);
          const savedFile = await this.create({
            filename: filename,
            path: `/uploads/${type}/${filename}`,
            origin_name: file.originalname,
            type,
          });
          resolve({ url: `/api/files/${savedFile.filename}` });
          // 返回上传成功的信息及访问文件的地址路径
        } catch (error) {
          console.error('Error saving file:', error);
          reject(new BadRequestException('Error saving file'));
        }
      });
    });
  }
}
