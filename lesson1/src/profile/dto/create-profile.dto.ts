import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class createProfile {
  @MinLength(3)
  @MaxLength(50)
  @IsString()
  name: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @IsOptional()
  @IsEmail()
  email?: string;
}
