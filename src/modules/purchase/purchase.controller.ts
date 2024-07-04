import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Public } from '../common/decorator/public.decorator';
import { PurchaseEntity } from './entity/purchase.entity';
import { PurchaseService } from './purchase.service';
import { ApiTags } from '@nestjs/swagger';
import { DiscountPayload } from './paylaod/discount.payload';
@Crud({
  model: {
    type: PurchaseEntity,
  },
  query: {
    join: {
      books: {
        eager: true,
      },
    },
  },
})
@Controller('api/v1/purchases')
@ApiTags('purchases')
@Public()
export class PurchaseController implements CrudController<PurchaseEntity> {
  constructor(public service: PurchaseService) {}

  @Public()
  @Get('all-books')
  async getAll(): Promise<any> {
    return this.service.getAllPurchase();
  }

  @Public()
  @Post(':id/discount')
  async newDiscounr(
    @Body() paylaod: DiscountPayload,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<any> {
    return this.service.newDiscount({ onPurchase: id, ...paylaod });
  }

  @Public()
  @Post('discounts')
  async getAllDiscounts(): Promise<any> {
    return this.service.getAllDiscounts();
  }
}
