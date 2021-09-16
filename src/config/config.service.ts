import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

require('dotenv').config();

export class ConfigService {
  public env: { [key: string]: string };
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    //this.env = dotenv.parse(fs.readFileSync(filePath));
  }

  private transformEnvDataToObj (envData: string) {
    const temporaryArr = envData.toLowerCase().split('_');
    for (let i = 0; i < temporaryArr.length; i++) {
      if (i !== 0) {
        temporaryArr[i] = temporaryArr[i].charAt(0).toUpperCase() + temporaryArr[i].substring(1);
      }
    }
    return temporaryArr.join('');
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = dotenv.parse(fs.readFileSync(this.filePath))[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    const env = {};
    keys.forEach(k => {
      env[this.transformEnvDataToObj(k)] = this.getValue(k, true)
    });
    this.env = env;
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = process.env.NODE_ENV || 'development';
    return mode != 'development';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      synchronize: true,

      entities: ['dist/**/*.entity{.ts,.js}'/*, 'src/!**!/!*.entity{.ts,.js}'*/],

      migrationsTableName: 'migrations',

      migrations: ['dist/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
    };
  }

}

const configServiceInstance = new ConfigService(`.${process.env.NODE_ENV || 'development'}.env`)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE',
    'API_URL'
  ]);

export { configServiceInstance };
