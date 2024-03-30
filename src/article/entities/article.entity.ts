export class ArticleEntity {
  id: number;

  title: string;

  content: string;

  desc: string;

  like_count: number;

  view_count: number;

  update_time: number;

  delete_time: number;

  constructor(partial: Partial<ArticleEntity>) {
    Object.assign(this, partial);
  }
}
