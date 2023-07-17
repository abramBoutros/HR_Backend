import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //Enable the use of Helmet
  app.use(helmet());

  //Enable CORS
  app.enableCors({
    // TODO: Add the expected origin here ex: http://localhost:3000
    origin: '*',
    // TODO: Add the expected methods here ex: GET,HEAD,PUT,PATCH,POST,DELETE
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // TODO: Add the expected headers here ex: Content-Type, Accept
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3210);
}
bootstrap();
