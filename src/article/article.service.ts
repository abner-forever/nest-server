import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './model/article.model';
import { FindOptions } from 'sequelize';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from 'src/users/model/user.model';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private readonly articleModel: typeof Article,
  ) {}

  // 分页查询文章列表
  async getArticleList({
    pageNum = 1,
    pageSize = 10,
    userId,
  }: {
    pageNum?: number;
    pageSize?: number;
    userId?: number;
  }) {
    const offset = (pageNum - 1) * pageSize; // 计算偏移量

    // 构建查询选项
    const options: FindOptions = {
      offset,
      limit: pageSize,
      include: [], // 添加 include 选项用于关联查询
      attributes: { exclude: ['content'] }, // 排除 content 字段
    };

    if (userId) {
      options.where = { author_id: userId };
    }
    // 关联查询用户表，并获取关联的用户名信息
    options.include = [{ model: User, attributes: ['username'] }];
    // 执行查询
    const { count, rows } = await this.articleModel.findAndCountAll(options); // 查询总文章数和当前页文章列表

    const currentPage = pageNum; // 当前页码
    const totalPages = Math.ceil(count / pageSize); // 总页数
    const hasNextPage = currentPage < totalPages; // 是否有下一页
    // 将嵌套结构展平
    const list = rows.map((article) => ({
      ...article.toJSON(),
      author: article.user.username, // 将作者信息从嵌套结构中提取出来
    }));
    return { list, currentPage, totalPages, hasNextPage }; // 返回带有页码相关信息的响应数据
  }

  // 根据id查询文章
  findById(id: number) {
    return this.articleModel.findOne({
      where: {
        id,
      },
    });
  }
  async create(createUserDto: CreateArticleDto) {
    await this.articleModel.create(createUserDto);
    return null;
  }
  async update(updateArticleDto: UpdateArticleDto) {
    await this.articleModel.update(updateArticleDto, {
      where: {
        // 更新条件，例如：id
        id: updateArticleDto.id,
      },
    });
    return null;
  }
  async delete(id: number) {
    await this.articleModel.destroy({
      where: {
        id,
      },
    });
  }
}
