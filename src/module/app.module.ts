import { ClassSerializerInterceptor, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '../utils/interceptor/logging.interceptor';
import { TransformInterceptor } from '../utils/interceptor/transform.interceptor';
import { TimeoutInterceptor } from '../utils/interceptor/timeout.interceptor';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from '../utils/guard/roles.guard';
import { ArticleModule } from './article/article.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from './file/file.module';
import { TaskModule } from './tasks/tasks.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: ~~process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      database: process.env.DB_NAME,
      define: {
        // 设置全局模型选项
        timestamps: true,
        underscored: true,
        createdAt: 'createTime',
        updatedAt: 'updateTime',
        deletedAt: 'deleteTime',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== 'production', // 设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
    }),
    UsersModule,
    AuthModule,
    FileModule,
    ArticleModule,
    ScheduleModule.forRoot(),
    TaskModule,
    CalendarModule,
  ],
  controllers: [],
  providers: [
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure() {}
}
