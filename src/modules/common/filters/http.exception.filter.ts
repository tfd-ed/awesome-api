import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const reponse = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    reponse.status(status).json({
      statusCode: status,
      message: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
