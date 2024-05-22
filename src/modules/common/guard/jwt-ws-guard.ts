import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

@Injectable()
export class JWTWSGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    let { token } = context.switchToWs().getClient().handshake.auth;
    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, this.configService.get('JWT_SECRET_KEY'));
    if (decoded) {
      return true;
    }
    return false;
  }
}
