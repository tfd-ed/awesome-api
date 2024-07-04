import { ApiProperty } from '@nestjs/swagger';

export class DiscountPayload {
  @ApiProperty({
    required: true,
    example: '235.53',
  })
  price: number;
}
