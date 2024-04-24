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

  async findWeekends(
    year: string,
  ): Promise<Observable<AxiosResponse<any, any>>> {
    const cacheWeekends = await this.redis.get(`weekends_${year}`);
    if (cacheWeekends) {
      return Promise.resolve(JSON.parse(cacheWeekends));
    }
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(`https://api.jiejiariapi.com/v1/weekends/${year}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    this.redis.set(
      `weekends_${year}`,
      JSON.stringify(data),
      'EX',
      60 * 60 * 24 * 30,
    );
    return data;
  }
}
