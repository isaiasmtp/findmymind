import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from '@nestjs/typeorm';
import * as dotenv from 'dotenv'

dotenv.config({
  path: process.env.ENV === 'test' ? '.test.env' : '.env'
})

export default class TypeOrmConfig {
  static getOrmConfig(): TypeOrmModuleOptions {
    const dbType = process.env.DB_TYPE as 'postgres';

    return {
      type: dbType,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> =>
    TypeOrmConfig.getOrmConfig(),
};
