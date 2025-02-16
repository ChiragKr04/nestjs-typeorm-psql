import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';

const envPath = `.env.${process.env.NODE_ENV || 'dev'}`;
config({ path: path.resolve(process.cwd(), envPath) });
const configService = new ConfigService({});

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  ssl:
    configService.get('NODE_ENV') === 'prod'
      ? { rejectUnauthorized: false }
      : false,
});
