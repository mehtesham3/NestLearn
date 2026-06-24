import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class updateProductDTO {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @IsString()
  @IsOptional()
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

export class updateStock {
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;
}
