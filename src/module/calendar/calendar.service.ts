import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import Redis from 'ioredis';
import { Observable, catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  /** 查询工作日 */
  async findWorkdays(
    year: string,
  ): Promise<Observable<AxiosResponse<any, any>>> {
    const cacheWorkdays = await this.redis.get(`workdays_${year}`);
    if (cacheWorkdays) {
      return Promise.resolve(JSON.parse(cacheWorkdays));
    }
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(`https://api.jiejiariapi.com/v1/workdays/${year}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    this.redis.set(
      `workdays_${year}`,
      JSON.stringify(data),
      'EX',
      60 * 60 * 24 * 30,
    );
    return data;
  }
  /** 查询节假日 */
  async findHolidays(
    year: string,
  ): Promise<Observable<AxiosResponse<any, any>>> {
    const cacheHolidays = await this.redis.get(`holidays_${year}`);
    if (cacheHolidays) {
      return Promise.resolve(JSON.parse(cacheHolidays));
    }
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(`https://api.jiejiariapi.com/v1/holidays/${year}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    this.redis.set(
      `holidays_${year}`,
      JSON.stringify(data),
      'EX',
      60 * 60 * 24 * 30,
    );
    return data;
  }
}
