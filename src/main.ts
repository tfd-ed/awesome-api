import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';
import { HttpExceptionFilter } from './modules/common/filters/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  setupSwagger(app);
  await app.listen(5000);
}
bootstrap();
