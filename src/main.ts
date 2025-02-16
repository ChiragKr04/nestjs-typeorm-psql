import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //  get data from config
  const envPath = `.env.${process.env.NODE_ENV || 'dev'}`;
  config({ path: path.resolve(process.cwd(), envPath) });
  const configService = new ConfigService({});

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  const PORT = Number.parseInt(configService.get('APP_PORT')) ?? 3000;
  await app.listen(configService.get('APP_PORT'));
  console.info(
    `Server running on http://localhost:${configService.get('APP_PORT')}`,
  );
}
bootstrap();
