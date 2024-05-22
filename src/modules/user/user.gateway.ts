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
import { UsersService } from './user.service';

@WebSocketGateway({ cors: true })
export class UserGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UsersService) {}
  private logger = new Logger(UserGateWay.name);
  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('User GateWay Initilaized');
  }
  handleConnection(client) {
    this.logger.log(`Client Id: ${client.id} connected!`);
  }
  handleDisconnect(client) {
    this.logger.log(`Client Id: ${client.id} dsiconnected!`);
  }

  @SubscribeMessage('ask-for-user')
  async updateUserToClient() {
    const allUsers = await this.userService.getAll();
    this.io.emit('user-updated', allUsers);
  }
}
