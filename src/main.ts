import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { CrudConfigService } from '@nestjsx/crud';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const helmet = require('helmet');

CrudConfigService.load({
  query: {
    limit: 10,
    cache: 2000,
    alwaysPaginate: true,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
});

// Eslint
import { AppModule } from './app/app.module';
import { RedisIoAdapter } from './modules/common/adapter/ws.adapter';
// import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(path.join(__dirname, '../localhost-key.pem')),
  //   cert: fs.readFileSync(path.join(__dirname, '../localhost.pem')),
  // };

  // const app = await NestFactory.create(AppModule, { httpsOptions });

  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  setupSwagger(app);
  // Enable Cors for development
  app.enableCors();
  // Global Pipe to intercept request and format data accordingly
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // Listen to port given by environment on production server (Heroku, DigitalOcean App,..), otherwise 3000
  // Specify '0.0.0.0' in the listen() to accept connections on other hosts.
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
