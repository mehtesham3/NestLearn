import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class createProductDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @IsString()
  @IsIn([
    'Electronics',
    'Apparel',
    'Home & Garden',
    'Beauty & Personal Care',
    'Toys & Games',
    'Sports & Outdoors',
    'Health & Wellness',
    'Books & Media',
  ])
  category: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
