import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  Res,
  HttpCode,
  Body,
  Delete,
} from '@nestjs/common';

import { UserService } from './user.service';

import { Request, Response } from 'express';
import { UserDTO } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUser() {
    return this.userService.getUsers();
  }

  @HttpCode(201)
  @Post()
  createUser(@Body() body: UserDTO, @Res() res: Response) {
    const result = this.userService.createUser(body);
    return res.json(result);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number, @Res() res: Response) {
    const result = this.userService.deleteUser(id);
    return res.json(result);
  }

  // @HttpCode(201)
  // @Post('devices')
  // createDevice(@Res() res: Response) {
  //   const result = this.userService.createDevice();

  //   return res.json(result);
  // }

  @Get(':userId')
  getAllUserDevices(@Req() req: Request) {
    console.log(req.query);
    return this.userService.getUsers();
  }

  @Get('/devices/:deviceId')
  getDevices(
    @Param('deviceId') id: string,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    console.log(page);
    console.log(limit);
    return this.userService.getUsers();
  }
}
