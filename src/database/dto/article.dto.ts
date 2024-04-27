import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    name: 'title',
    description: '文章标题',
  })
  title: string;
  @ApiProperty({
    name: 'description',
    description: '文章描述',
  })
  description: string;
  @ApiProperty({
    name: 'content',
    description: '文章内容',
  })
  content: string;
  authorId: number;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty()
  id: number;
  viewCount?: number;
}
export class ListParams {
  @ApiProperty({
    name: 'pageNum',
    description: '页码',
  })
  pageNum?: number;
  @ApiProperty({
    name: 'pageSize',
    description: '页面数量',
  })
  pageSize?: number;
  userId?: number;
}
