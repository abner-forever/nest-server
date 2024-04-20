import { PartialType } from '@nestjs/mapped-types';

export class CreateArticleDto {
  title: string;
  description: string;
  content: string;
  author_id: number;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  id: number;
}
