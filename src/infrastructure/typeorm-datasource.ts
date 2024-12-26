import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AppConfigService } from '@src/configs/config.service';

config({ path: AppConfigService.getEnvFilePath() });

const configService = new ConfigService();
const AppDataSource = new DataSource(
  AppConfigService.getTypeOrmModuleOptions(configService),
);

export default AppDataSource;
