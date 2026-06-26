import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    example: 'name',
    required: true,
    description: 'Name of the user'
  })
  @IsString()
  name: string;

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

  @ApiProperty({
    example: 'Building1, Street10, Baghdad, Iraq',
    required: true,
    description: 'Address of the user'
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: 'user or admin',
    required: true,
    description: 'Role of the user'
  })
  @IsString()
  @IsOptional()
  @IsIn(['user', 'admin'])
  role: string;
}
