import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column()
  username: string;
  @Column()
  fullname: string;
  @Column({ type: 'int' })
  age: number;
  @Column({ nullable: true })
  grade: string;
  @Column({ nullable: true })
  address: string;
}
