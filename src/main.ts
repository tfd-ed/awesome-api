import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  // Hello
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
}
bootstrap();
