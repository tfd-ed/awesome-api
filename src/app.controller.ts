import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('Hello');
    return this.appService.getHello();
  }

  @Get('hello2')
  getHello2(): string {
    console.log('Hello2');
    return this.appService.getGreeting();
  }
}
