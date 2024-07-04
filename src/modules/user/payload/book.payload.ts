import { ApiProperty } from '@nestjs/swagger';

export class BookPayload {
  @ApiProperty({
    required: true,
    example: 'Cambodia',
  })
  title: string;
  @ApiProperty({
    required: true,
    example: '23-11-1993',
  })
  dateOfPublished: string;

  @ApiProperty({
    required: true,
    example: 'horror',
  })
  category: string;
}
