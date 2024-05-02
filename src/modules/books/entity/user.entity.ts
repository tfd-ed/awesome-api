import { CommonEntity } from 'src/modules/common/entity/common';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'books' })
export class BookEntity extends CommonEntity {
  @Column()
  title: string;

  @Column()
  dateOfPublished: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  category: string;
}
