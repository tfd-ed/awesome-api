import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from '../modules/common/interceptor/timeout.interceptor';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../modules/auth/jwt-guard';
import { CommonModule } from '../modules/common/common.module';
import { AuthModule } from '../modules/auth/auth.module';
import { UserModule } from '../modules/user';
import { LoggingInterceptor } from '../modules/common/interceptor/logging.interceptor';
import { RolesGuard } from '../modules/common/guard/roles.guard';
import { BookModule } from 'src/modules/books/book.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { NoCacheInterceptor } from 'src/modules/common/interceptor/no-cache.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (process.env.NODE_ENV === 'development') {
          return {
            type: configService.get<string>('DB_TYPE'),
            host: configService.get<string>('DB_HOST'),
            port: configService.get<string>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            entities: [__dirname + './../**/**.entity{.ts,.js}'],
            subscribers: [__dirname + './../**/**/*.subscriber.{ts,js}'],
            synchronize: configService.get<string>('DB_SYNC'),
            retryAttempts: 20,
          } as TypeOrmModuleAsyncOptions;
        }
        if (process.env.NODE_ENV === 'production') {
          /**
           * Use database url in production instead
           */
          return {
            type: configService.get<string>('DB_TYPE'),
            url: configService.get<string>('DATABASE_URL'),
            entities: [__dirname + './../**/**.entity{.ts,.js}'],
            subscribers: [__dirname + './../**/**/*.subscriber.{ts,js}'],
            synchronize: configService.get('DB_SYNC'),
            ssl: true,
            retryAttempts: 20,
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
          } as TypeOrmModuleAsyncOptions;
        }
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ttl: configService.get<string>('CACHE_TTL'), // seconds
          max: configService.get<string>('CACHE_MAX'), // maximum number of items in cache
          store: redisStore,
          host: configService.get<string>('CACHE_HOST'),
          port: configService.get<string>('CACHE_PORT'),
        };
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    BookModule,
    CommonModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: NoCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule { }
