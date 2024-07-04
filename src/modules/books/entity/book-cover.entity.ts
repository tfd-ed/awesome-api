import { CommonEntity } from 'src/modules/common/entity/common';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BookEntity } from './book.entity';

@Entity('book-covers')
export class BookCoverEntity extends CommonEntity {
  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  path: string;

  @Column({ type: 'text' })
  mimeType: string;

  @Column({ type: 'float' })
  size: number;

  // AWS Property
  @Column({ type: 'text', nullable: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @ManyToOne(() => BookEntity)
  book: string;
}
export class FileFillableFields {
  name: string;
  path: string;
  mimeType: string;
  size: number;
  buffer: any;
}
