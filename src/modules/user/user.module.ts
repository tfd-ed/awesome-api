import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './user.service';
import { UserNotification } from './user.notification';
import { UserEvent } from './user.event';
import { BookEntity } from '../books/entity/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BookEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [UsersService],
  controllers: [UserController],
  providers: [UsersService, UserNotification, UserEvent],
})
export class UserModule {}
