import { UserEntity } from '../../user/entity/user.entity';
import { CommonEntity } from '../../common/entity/common';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'books' })
export class BookEntity extends CommonEntity {
  @Column()
  title: string;

  @Column()
  dateOfPublished: string;

  @ManyToOne(() => UserEntity, (user) => user.books)
  @JoinColumn({ name: 'userId' })
  user: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  isbn: string;

  @Column({ type: 'text', nullable: true })
  doi: string;
}
