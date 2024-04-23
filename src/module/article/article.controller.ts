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

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Public()
  @Get()
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
  @Get('detail/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async detail(@Req() req, @Param('id') id: string) {
    return this.articleService.findById(+id, req?.user?.userId);
  }
  @Get('my')
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
  async add(@Req() req, @Body() article: CreateArticleDto) {
    return this.articleService.create({
      ...article,
      authorId: req.user.userId,
    });
  }
  @Post('update')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() article: UpdateArticleDto) {
    return this.articleService.update(article);
  }
  @Delete()
  @UseInterceptors(ClassSerializerInterceptor)
  async remove(@Body() { id }) {
    return this.articleService.delete(id);
  }
}
