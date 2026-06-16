import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'User email address',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password (min 6 characters)',
    minLength: 6,
    required: true,
  })
  @MinLength(6)
  @MaxLength(25)
  @IsString()
  password: string;

  // @IsString()
  // role: string;
}
