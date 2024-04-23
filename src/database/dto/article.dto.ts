import { PartialType } from '@nestjs/mapped-types';

export class CreateArticleDto {
  title: string;
  description: string;
  content: string;
  authorId: number;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  id: number;
  viewCount?: number;
}
export class ListParams {
  pageNum?: number;
  pageSize?: number;
  userId?: number;
}
