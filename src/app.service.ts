import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World 222!';
  }
  getGreeting(): string {
    return 'Hello from NestJS BootCamp';
  }
}
