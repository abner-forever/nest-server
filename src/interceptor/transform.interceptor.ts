// transform.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: 0, // 成功状态码
        message: 'success', // 成功消息
        data, // 数据
      })),
      catchError((error) => {
        if (error instanceof UnauthorizedException) {
          return of({
            code: 401,
            message: error.message,
            data: null,
          });
        } else {
          return throwError({
            code: 500,
            message: 'Internal Server Error',
            data: null,
          });
        }
      }),
    );
  }
}
