import { CommonEntity } from 'src/modules/common/entity/common';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PurchaseEntity } from './purchase.entity';

@Entity('discounts')
export class DiscountEntity extends CommonEntity {
  @Column({ type: 'money' })
  price: number;

  @OneToOne(() => PurchaseEntity)
  @JoinColumn()
  onPurchase: string;
}
