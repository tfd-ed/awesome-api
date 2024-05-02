import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { SimpleMiddleware } from './middlewares/simple.middlewares';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeormConfig } from './config';
import { BookModule } from './modules/books/book.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormConfig,
    }),
    UserModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SimpleMiddleware)
      .forRoutes({ path: 'users/*', method: RequestMethod.GET });
  }
}
