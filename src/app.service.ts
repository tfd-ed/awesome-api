import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getGreeting(): string {
    return 'Hello from NestJS BootCamp';
  }
}
