import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginPayload {
  @ApiProperty({
    required: true,
    example: 'user',
  })
  @IsNotEmpty()
  username: string;
  @ApiProperty({
    required: true,
    example: 'admin',
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
