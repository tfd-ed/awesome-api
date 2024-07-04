import {
  BadRequestException,
  Body,
  Injectable,
  NotAcceptableException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { Hash } from '../../utils/Hash';
import { UUIDType } from '../common/validator/FindOneUUID.validator';
import { ResetPayload } from '../auth/payloads/reset.payload';
import { UpdatePayload } from './payloads/update.payload';
import { RegisterPayload } from '../auth/payloads/register.payload';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BookEntity } from '../books/entity/book.entity';
import { BookPayload } from './payload/book.payload';
// import { WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'socket.io';

@Injectable()
export class UsersService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {
    super(userRepository);
  }
  // @WebSocketServer() io: Server;

  async get(@Param() id: UUIDType) {
    return this.userRepository.findOne(id);
  }

  async getByUsername(username: string) {
    return await this.userRepository.findOne({ username: username });
  }

  async update(
    @Param() id: UUIDType,
    @Body() updatePayload: UpdatePayload,
  ): Promise<any> {
    const admin = await this.userRepository.findOne(id);
    const updated = Object.assign(admin, updatePayload);
    delete updated.password;
    try {
      return await this.userRepository.save(updated);
    } catch (e) {
      throw new NotAcceptableException('Username or Email already exists!');
    }
  }

  async getAll(): Promise<UserEntity[]> {
    const queryBuilder = await this.userRepository.createQueryBuilder('a');
    queryBuilder.orderBy('a.updatedDate', 'DESC');
    return queryBuilder.execute();
  }

  async changPassword(payload: ResetPayload): Promise<any> {
    const user = await this.getByUsername(payload.username);
    if (!user || !Hash.compare(payload.currentPassword, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    await this.userRepository
      .createQueryBuilder('users')
      .update(UserEntity)
      .set({ password: payload.newPassword })
      .where('username =:username', { username: payload.username })
      .execute();
    return user;
  }

  async create(payload: RegisterPayload) {
    const user = await this.getByUsername(payload.username);
    if (user) {
      throw new NotAcceptableException(
        'Admin with provided username already created.',
      );
    }
    return await this.userRepository.save(this.userRepository.create(payload));
  }

  async delete(@Param() id: UUIDType): Promise<any> {
    const user = await this.userRepository.findOne(id);
    const deleted = await this.userRepository.delete(id);
    if (deleted.affected === 1) {
      return { message: `Deleted ${user.username} from records` };
    } else {
      throw new BadRequestException(
        `Failed to delete a profile by the name of ${user.username}.`,
      );
    }
  }

  async getBooksByUserID(id: string) {
    const books = await this.userRepository.findOne({ id: id });
    return books;
  }

  async createBookForUser(payload: BookPayload & { user: string }) {
    const newBook = await this.bookRepository.save(
      this.bookRepository.create(payload),
    );
    const user = await this.userRepository.findOne(payload.user);
    if (user) {
      user.books.push(newBook.id);
      await this.userRepository.save(user);
    }
    return newBook;
  }

  // sendUserToClient(user: UserEntity) {
  //   this.io.emit('user-updated', user);
  // }
}
