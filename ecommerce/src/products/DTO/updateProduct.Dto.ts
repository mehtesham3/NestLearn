import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Product name',
    required: false,
    description: 'Product name which can`t be empty and should be string',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({
    example: 'Description',
    required: false,
    description: 'Descripion of product not exceed by 1000 characters',
    maxLength: 1000,
    type: String,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;

  @ApiProperty({
    example: '250',
    required: false,
    description: 'Price of the product not be negative',
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty({
    example: '90',
    required: false,
    description: 'Stock of the product not be negative',
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @ApiProperty({
    example: 'Toys & Games',
    required: false,
    description: 'Category of the product',
    enum: [
      'Electronics',
      'Apparel',
      'Home & Garden',
      'Beauty & Personal Care',
      'Toys & Games',
      'Sports & Outdoors',
      'Health & Wellness',
      'Books & Media',
    ],
  })
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

  @ApiProperty({
    example: 'https://example.com/newImage.jpg',
    required: false,
    description: 'Image URL of the product',
    type: String,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class updateStock {
  @ApiProperty({
    example: '190',
    required: true,
    description: 'Stock of the product not be negative',
    minimum: 0,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;
}
