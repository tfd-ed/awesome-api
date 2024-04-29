import { Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  // Database
  allUser = [];
  // Read
  getUsers(): any[] {
    return this.allUser;
  }
  // Read by UserID
  getUser(id: number): UserEntity {
    let user;
    this.allUser.forEach((item) => {
      if (item.id == id) {
        user = item;
      }
    });
    return user;
  }
  // Create
  // createUser(userdto: UserDTO): UserEntity {
  //   const user = new UserEntity(userdto);
  //   this.allUser.push(user);
  //   return user;
  // }
  // Delete
  deleteUser(id: number): UserEntity {
    const user = this.allUser.find((item) => {
      return item.id == id;
    });
    const index = this.allUser.indexOf(user);
    if (index > -1) {
      this.allUser.splice(index, 1);
    }
    return user;
  }
}
