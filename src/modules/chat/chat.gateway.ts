import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(ChatGateWay.name);
  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('WebSocket Initilaized');
  }
  handleConnection(client) {
    this.logger.log(`Client Id: ${client.id} connected!`);
  }
  handleDisconnect(client) {
    this.logger.log(`Client Id: ${client.id} dsiconnected!`);
  }

  @SubscribeMessage('hello-tfd')
  handleMessage(client: any, data: any) {
    this.logger.log(`Client Id: ${client.id} connected!`);
    this.logger.log(data);
  }
}
