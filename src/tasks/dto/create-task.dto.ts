export class CreateTasksDto {
  title: string;
  description: string;
  /**
   * 0- 未完成
   * 1- 已完成
   */
  status: number;
  user_id: number;
  spend_time: number;

  type: string;

  rate: number;
}
