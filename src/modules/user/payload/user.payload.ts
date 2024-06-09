import { ApiProperty } from '@nestjs/swagger';

export class UserPayload {
    @ApiProperty({
        required: true,
        example: 'dara2342',
    })
    username: string;
    @ApiProperty({
        required: true,
        example: 'dara2342@gmail.com',
    })
    email: string;
    @ApiProperty({
        required: true,
        example: 'Chau Dara',
    })
    name: string;
    @ApiProperty({
        required: true,
        example: '123456789',
    })
    password: string;
}
