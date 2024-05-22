import { Module } from '@nestjs/common';
import { ChatGateWay } from './chat.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ChatGateWay],
})
export class ChatModule {}
