import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from './utils/filter/http-exception.filter';
import { ValidationPipe } from './utils/pipe/validation';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

declare const module: any;

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  // 设置请求体大小限制为 10MB
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('blog api')
    .setDescription('我的博客接口文档')
    .setVersion('1.0')
    .addTag('blogs')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('apis/doc', app, document);
  await app.listen(8080);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
main();
