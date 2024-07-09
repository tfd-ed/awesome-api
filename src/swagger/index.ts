import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import {
  API_CURRENT_VERSION,
  API_DESCRIPTION,
  API_NAME,
  API_ROOT,
  SITE_TITLE,
} from './configs';
import * as fs from 'fs';

export const setupSwagger = (app: INestApplication) => {
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: SITE_TITLE,
    /**
     * Persist authorization after page refresh
     */
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const options = new DocumentBuilder()
    .setTitle(API_NAME)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_CURRENT_VERSION)
    .addTag('Auth')
    .addTag('Users')
    .addTag('Books')
    .addTag('Purchases')
    .addServer('/api/v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup(API_ROOT, app, document, customOptions);
};
