import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  CreateArticleDto,
  UpdateArticleDto,
} from 'src/database/dto/article.dto';
import { Public } from 'src/utils/decorator/auth.decorator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Public()
  @Get('list')
  async getArticleList(
    @Query('pageNum') pageNum: number = 1, // 默认页码为 1
    @Query('pageSize') pageSize: number = 10, // 默认每页数量为 10
  ) {
    return this.articleService.getArticleList({
      pageNum: +pageNum,
      pageSize: +pageSize,
    }); // 调用文章服务的 findWithPagination 方法进行分页查询
  }
  @Public()
  @Get('deatil/:id')
  async getArticleDetail(@Param('id') id: string) {
    return this.articleService.findById(+id);
  }
  @Get('list/my')
  @UseInterceptors(ClassSerializerInterceptor)
  async getArticleListByUser(
    @Req() req,
    @Query('pageNum') pageNum: number = 1, // 默认页码为 1
    @Query('pageSize') pageSize: number = 10, // 默认每页数量为 10
  ) {
    return this.articleService.getArticleList({
      pageNum: +pageNum,
      pageSize: +pageSize,
      userId: req.user.userId,
    });
  }
  @Post('add')
  @UseInterceptors(ClassSerializerInterceptor)
  async addArticle(@Req() req, @Body() article: CreateArticleDto) {
    return this.articleService.create({
      ...article,
      author_id: req.user.userId,
    });
  }
  @Post('update')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateArticle(@Body() article: UpdateArticleDto) {
    return this.articleService.update(article);
  }
  @Delete('delete')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteArticle(@Body() { id }) {
    return this.articleService.delete(id);
  }
}
