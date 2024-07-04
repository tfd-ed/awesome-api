import { BookEntity } from 'src/modules/books/entity/book.entity';
import { CommonEntity } from 'src/modules/common/entity/common';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('purchases')
export class PurchaseEntity extends CommonEntity {
  @Column({ type: 'money' })
  price: number;

  @ManyToMany(() => BookEntity)
  @JoinTable()
  books: BookEntity[];
}
