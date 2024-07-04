import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PurchaseEntity } from './entity/purchase.entity';
import { BookEntity } from '../books/entity/book.entity';
import { DiscountPayload } from './paylaod/discount.payload';
import { DiscountEntity } from './entity/discount.entity';

@Injectable()
export class PurchaseService extends TypeOrmCrudService<PurchaseEntity> {
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
  ) {
    super(purchaseRepository);
  }

  async getAllPurchase() {
    //1st way
    // 2nd way
    const result = await this.purchaseRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.books', 'b')
      .getMany();
    console.log(result);
    return result;
  }

  async newDiscount(payload: DiscountPayload & { onPurchase: string }) {
    console.log(payload);
    const newDicount = await this.discountRepository.save(
      this.discountRepository.create(payload),
    );
    return newDicount;
  }

  async getAllDiscounts() {
    return await this.discountRepository.find({ relations: ['onPurchase'] });
  }
}
