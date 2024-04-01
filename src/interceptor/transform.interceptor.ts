import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UnauthorizedException } from '@nestjs/common';
import { convertKeysToCamelCase } from 'src/utils';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: 0, // 成功状态码
        message: 'success', // 成功消息
        data: convertKeysToCamelCase(this.serializeData(data)), // 序列化数据
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
            message: error.message || 'Internal Server Error',
            data: null,
          });
        }
      }),
    );
  }

  private serializeData(data: any): any {
    if (Array.isArray(data)) {
      // 如果返回的数据是数组，则递归调用 serializeData 方法处理数组中的每个元素
      return data.map((item) => this.serializeData(item));
    } else if (
      data &&
      typeof data === 'object' &&
      typeof data.toJSON === 'function'
    ) {
      // 如果返回的数据是一个对象，并且具有 toJSON 方法，则调用该方法并返回结果
      return data.toJSON();
    } else if (data && typeof data === 'object' && data.dataValues) {
      // 如果返回的数据是一个对象，并且包含 dataValues 属性，则直接返回 dataValues 属性的值
      return data.dataValues;
    } else if (data && typeof data === 'object') {
      // 如果返回的数据是一个对象，则进行简单的对象转换，并过滤掉 Sequelize 模型实例的额外属性
      const newObj = {};
      for (const key in data) {
        if (
          Object.prototype.hasOwnProperty.call(data, key) &&
          key !== '_previousDataValues' &&
          key !== 'uniqno' &&
          key !== '_changed' &&
          key !== '_options' &&
          key !== 'isNewRecord'
        ) {
          newObj[key] = this.serializeData(data[key]);
        }
      }
      return newObj;
    }
    // 其他情况直接返回原始数据
    return data;
  }
}
