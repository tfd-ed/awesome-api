import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class SimpleMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log('Hello from middleware');
    next();
  }
}
