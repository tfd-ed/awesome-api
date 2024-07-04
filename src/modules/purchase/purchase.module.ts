import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from './entity/purchase.entity';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { DiscountEntity } from './entity/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity, DiscountEntity])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseMoule {}
