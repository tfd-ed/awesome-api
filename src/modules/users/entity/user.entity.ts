import { UserDTO } from '../dto/user.dto';

export class UserEntity {
  constructor(dto: UserDTO) {
    this.id = dto.id;
    this.username = dto.username;
    this.fullname = dto.fullname;
    this.age = dto.age;
    this.grade = dto.grade;
  }
  id: number;
  username: string;
  fullname: string;
  age: number;
  grade: string;
}
