import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './user.service';
import { UserNotification } from './user.notification';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [UsersService],
  controllers: [UserController],
  providers: [UsersService, UserNotification],
})
export class UserModule { }
