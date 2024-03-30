import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filter/http-exception.filter';
// import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

declare const module: any;

async function main() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis', app, document);
  await app.listen(8080);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
main();
