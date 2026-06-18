import { IsEmail, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

export class RegisterDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  @IsIn(['user', 'admin'])
  role: string;
}
