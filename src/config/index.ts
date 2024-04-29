import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export async function typeormConfig(configService: ConfigService) {
  return {
    type: configService.get<string>('DB_TYPE'),
    host: configService.get<string>('DB_HOST'),
    port: configService.get<string>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: configService.get<string>('DB_SYNC'),
    entities: [join(__dirname, './../**/**.entity{.ts,.js}')],
  } as TypeOrmModuleAsyncOptions;
}
