import {
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  Body,
  Delete,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';

import { UserService } from './user.service';

import { UserDTO } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUser() {
    // In case no permission
    // return this.userService.getUsers();
    return this.userService.getUsers();
  }

  @HttpCode(201)
  @Post()
  createUser(@Body() body: UserDTO) {
    const result = this.userService.createUser(body);
    return result;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const result = this.userService.deleteUser(id);
    return result;
  }

  @Get(':userId')
  getUserById(@Param('userId') id: string) {
    return this.userService.getUser(id);
  }
}
