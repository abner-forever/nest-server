import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from '../../database/models/article';
import { FindOptions } from 'sequelize';
import { User } from 'src/database/models/user';
import {
  CreateArticleDto,
  ListParams,
  UpdateArticleDto,
} from 'src/database/dto/article.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
const expridTime = 600; // 10分钟
@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private readonly articleModel: typeof Article,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // 分页查询文章列表
  async getArticleList({ pageNum = 1, pageSize = 10, userId }: ListParams) {
    const offset = (pageNum - 1) * pageSize; // 计算偏移量

    // 构建查询选项
    const options: FindOptions = {
      offset,
      limit: pageSize,
      include: [], // 添加 include 选项用于关联查询
      attributes: { exclude: ['content'] }, // 排除 content 字段
    };

    if (userId) {
      options.where = { authorId: userId };
    }
    // 关联查询用户表，并获取关联的用户名信息
    options.include = [{ model: User, attributes: ['username'] }];
    const { count, rows } = await this.articleModel.findAndCountAll(options); // 查询总文章数和当前页文章列表

    const totalPages = Math.ceil(count / pageSize); // 总页数
    const hasNextPage = pageNum < totalPages; // 是否有下一页
    // 将嵌套结构展平
    const list = rows.map((article) => ({
      ...article.toJSON(),
      author: article.user.username, // 将作者信息从嵌套结构中提取出来
      user: undefined,
    }));
    return { list, pageNum, pageSize, totalPages, hasNextPage, totals: count }; // 返回带有页码相关信息的响应数据
  }

  // 根据id查询文章
  async findById(id: number, userId?: number) {
    const cacheCount = await this.redis.get(`article_${id}_count`);
    const data = await this.articleModel.findOne({
      where: { id },
      include: { model: User, attributes: ['username'] },
    });
    if (userId) {
      if (cacheCount === undefined) {
        data.viewCount++;
        await this.redis.set(`article_${id}_count`, data.viewCount);
        // 在用户访问文章的时候在 redis 存一个 10 分钟过期的标记，有这个标记的时候阅读量不增加
        await this.redis.set(`user_${userId}_post_${id}`, 1, 'EX', expridTime);
      } else {
        const flag = await this.redis.get(`user_${userId}_post_${id}`);
        if (!flag) {
          console.log('++');
          data.viewCount++;
          await this.redis.set(`article_${id}_count`, data.viewCount);
          await this.redis.set(
            `user_${userId}_post_${id}`,
            1,
            'EX',
            expridTime,
          );
        }
      }
      await this.update({ id, viewCount: data.viewCount });
    }
    if (!data) return null;
    console.log('data.viewCount', data.viewCount);
    return {
      ...data?.toJSON(),
      user: undefined,
      author: data.user.username,
      viewCount: data.viewCount,
    };
  }
  async create(createUserDto: CreateArticleDto) {
    const res = await this.articleModel.create(createUserDto);
    return {
      id: res.dataValues.id,
    };
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
