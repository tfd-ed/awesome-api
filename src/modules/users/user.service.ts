import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { UserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  // Database
  allUser = [];
  // Read
  async getUsers(): Promise<any[]> {
    try {
      const users = await this.userRepository.find({
        where: {
          id: 'sdsdgsdgsdgsf',
        },
      });
      return users;
    } catch {
      throw new ForbiddenException();
    }
  }
  // Read by UserID
  async getUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    return user;
  }
  // Create
  async createUser(userdto: UserDTO): Promise<UserEntity> {
    const newUser = this.userRepository.create(userdto);
    await this.userRepository.save(newUser);
    return newUser;
  }
  // Delete
  async deleteUser(id: string): Promise<any> {
    const deleted = await this.userRepository.softDelete(id);
    return deleted;
  }
}
