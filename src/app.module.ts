import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { logger } from './middleware/logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
// import { CacheInterceptor } from './interceptor/cache.interceptor';
// import { ErrorsInterceptor } from './interceptor/exception.interceptor';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/model/user.model';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './guard/roles.guard';
import { ArticleModule } from './article/article.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from './file/file.module';
import { TaskModule } from './tasks/tasks.module';

@Module({
  imports: [
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
      models: [User],
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== 'production', // 设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
    }),
    UsersModule,
    AuthModule,
    FileModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(UsersController);
  }
}
