import { ClassSerializerInterceptor, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
// import { CacheInterceptor } from './interceptor/cache.interceptor';
// import { ErrorsInterceptor } from './interceptor/exception.interceptor';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './database/models/user';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './guard/roles.guard';
import { ArticleModule } from './article/article.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from './file/file.module';
import { TaskModule } from './tasks/tasks.module';
// import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    // RedisModule.forRoot({
    //   config: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    HttpModule,
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
      timezone: '+08:00', // 设置时区
      models: [User],
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== 'production', // 设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
    }),
    UsersModule,
    AuthModule,
    FileModule,
    ArticleModule,
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    AuthService,
    AppService,
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
