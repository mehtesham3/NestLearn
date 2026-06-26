import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'example@mail.com',
    required: true,
    description: 'Email of the user'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'p@ssword1_!',
    required: true,
    description: 'Password of the user'
  })
  @IsString()
  password: string;
}
