import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers(): string {
    return 'This is user 1';
  }
  createUser(): string {
    return 'User 1 created!';
  }
  createDevice(): string {
    return 'Device 1 created!';
  }
}
