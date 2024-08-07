import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { PurchaseMoule } from 'src/modules/purchase/purchase.module';
import { join } from 'path';
import { MailmanModule, MailmanOptions } from '@squareboat/nest-mailman';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appRoot = require('app-root-path');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'local.prod' ? '.env.local.prod' : '.env',
    }),
    // ConfigModule.forRoot({
    //   ignoreEnvFile: process.env.NODE_ENV === 'production',
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(process.env.NODE_ENV);
        // console.log(configService.get<boolean>('DB_SYNC'));
        if (process.env.NODE_ENV === 'dev') {
          const config = {
            type: configService.get<string>('DB_TYPE'),
            host: configService.get<string>('DB_HOST'),
            port: configService.get<string>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            entities: [__dirname + './../**.entity{.ts,.js}'],
            subscribers: [__dirname + './../**/**/*.subscriber.{ts}'],
            migrations: [__dirname + './../migrations/{*.ts,.js}'],
            synchronize: configService.get<string>('DB_SYNC') !== 'false',
            logNotifications: true,
          };
          return config as TypeOrmModuleAsyncOptions;
        }
        if (process.env.NODE_ENV === 'local.prod') {
          const config = {
            type: configService.get<string>('DB_TYPE'),
            host: configService.get<string>('DB_HOST'),
            port: configService.get<string>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            entities: [__dirname + './../**/**.entity{.ts,.js}'],
            subscribers: [__dirname + './../**/**/*.subscriber.{ts}'],
            migrations: [__dirname + './../migrations/{*.ts,.js}'],
            synchronize: false,
            migrationsRun: true,
          };
          return config as TypeOrmModuleAsyncOptions;
        }
        if (process.env.NODE_ENV === 'prod') {
          /**
           * Use database url in production instead
           */
          return {
            type: configService.get<string>('DB_TYPE'),
            url: configService.get<string>('DATABASE_URL'),
            entities: [__dirname + './../**/**.entity{.ts,.js}'],
            subscribers: [__dirname + './../**/**/*.subscriber.{js}'],
            migration: [join(__dirname, './../migrations/{*.ts,.js}')],
            synchronize: false,
            ssl: true,
            migrationsRun: true,
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
        if (process.env.NODE_ENV === 'prod') {
          return {
            ttl: configService.get('CACHE_TTL'), // seconds
            max: configService.get('CACHE_MAX'), // maximum number of items in cache
            store: redisStore,
            url: configService.get('REDIS_URL'),
            tls: {
              servername: configService.get('CACHE_HOST'),
              rejectUnauthorized: false,
            },
            // isGlobal: true,
          } as CacheModuleOptions;
        }
        return {
          ttl: configService.get<number>('CACHE_TTL'), // seconds
          max: configService.get<number>('CACHE_MAX'), // maximum number of items in cache
          store: redisStore,
          host: configService.get<string>('CACHE_HOST'),
          port: configService.get<number>('CACHE_PORT'),
        } as CacheModuleOptions;
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (process.env.NODE_ENV === 'prod') {
          return {
            ttl: config.get<number>('RATE_LIMIT_TTL'),
            limit: config.get<number>('RATE_LIMIT_ITEMS'),
            storage: new ThrottlerStorageRedisService({
              host: config.get<string>('CACHE_HOST'),
              port: config.get<number>('CACHE_PORT'),
              password: config.get<number>('CACHE_PASSWORD'),
              // url: configService.get('REDIS_URL'),
              tls: {
                servername: config.get<string>('CACHE_HOST'),
                rejectUnauthorized: false,
              },
            }),
          };
        }
        return {
          ttl: config.get<number>('RATE_LIMIT_TTL'),
          limit: config.get<number>('RATE_LIMIT_ITEMS'),
          storage: new ThrottlerStorageRedisService({
            host: config.get<string>('CACHE_HOST'),
            port: config.get<number>('CACHE_PORT'),
          }),
        };
      },
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    MailmanModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get('EMAIL_HOST'),
          port: +config.get('EMAIL_PORT'),
          username: config.get('EMAIL_USER'),
          password: config.get('EMAIL_PASSWORD'),
          from: config.get('MAIL_SENDER_ID'),
          path: appRoot + '/src/templates',
        } as MailmanOptions;
      },
    }),
    AuthModule,
    UserModule,
    BookModule,
    PurchaseMoule,
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
      useClass: ThrottlerGuard,
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
export class AppModule {}
