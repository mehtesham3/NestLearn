import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Product name',
    required: true,
    description: 'Product name which can`t be empty and should be string',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({
    example: 'Description',
    required: true,
    description: 'Descripion of product not exceed by 1000 characters',
    maxLength: 1000,
    type: String,
  })
  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;

  @ApiProperty({
    example: '150',
    required: true,
    description: 'Price of the product not be negative',
    minimum: 0,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty({
    example: '100',
    required: true,
    description: 'Stock of the product not be negative',
    minimum: 0,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @ApiProperty({
    example: 'Apparel',
    description: "make sure it only contains",
    required: true,
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
    example: 'https://example.com/image.jpg',
    description: 'Image url of the product'
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
