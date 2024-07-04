import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { PasswordTransformer } from '../password.transformer';
import { AppRoles } from '../../common/enum/roles.enum';
import { UsersType } from '../../common/enum/users-type.enum';
import { BookEntity } from '../../books/entity/book.entity';
import { CommonEntity } from '../../common/entity/common';
import { DiscountEntity } from 'src/modules/purchase/entity/discount.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends CommonEntity {
  /**
   * Unique username column
   */
  @Column({ length: 255, unique: true })
  username: string;

  /**
   * Name column
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * Email colum
   */
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({
    type: 'simple-array',
    enum: AppRoles,
    default: AppRoles.DEFAULT,
  })
  roles: AppRoles[];

  @OneToMany(() => BookEntity, (book) => book.user, {
    nullable: true,
    eager: true,
  })
  books: string[];

  @OneToOne(() => DiscountEntity)
  @JoinColumn()
  discount: string;

  /**
   * Password column
   */
  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UsersType,
    default: UsersType.PASSWORD,
  })
  userType: string;

  @Column({ type: 'text', nullable: true })
  picture: string;

  /**
   * Omit password from query selection
   */
  toJSON() {
    const { password, ...self } = this;
    return self;
  }
}
