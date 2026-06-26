import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class userUpdateDTO {
  @ApiProperty({
    example: 'new name',
    description: 'name of the user ',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'email@mail.com',
    description: 'email of the user '
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'Kushtuntunia, Istanbul, Turkey',
    description: 'address of the user'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'new P@ssword(3#*)',
    description: 'password of the user'
  })
  @IsOptional()
  @IsString()
  password?: string;
}
