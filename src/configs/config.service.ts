import { Module } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

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
}
