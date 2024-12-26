import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({})
export class AppConfigService {
  static getConfigModuleOptions(): ConfigModuleOptions {
    return {
      envFilePath: path.join(__dirname, 'env', '.env'),
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    };
  }

  static getTypeOrmModuleOptions(
    configService: ConfigService,
  ): DataSourceOptions {
    const dbConfig: DataSourceOptions = {
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      synchronize: false,
      logging: true,
      entities: ['dist/**/domain/*.entity.{ts,js}'],
      migrations: ['dist/migrations/**/*{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
      migrationsRun: true,
    };

    return dbConfig;
  }

  static getTypeOrmModuleConfigs(): TypeOrmModuleAsyncOptions {
    return {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...this.getTypeOrmModuleOptions(configService),
      }),
      inject: [ConfigService],
    };
  }
}
