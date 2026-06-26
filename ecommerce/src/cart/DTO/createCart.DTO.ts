import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Types } from 'mongoose';

export class createCartDTO {
  @ApiProperty({
    example: '6a37d9680300420be67ba24e',
    description: 'Product id which must be mongoId',
    required: true,
    type: String,
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @ApiProperty({
    example: '1',
    description: 'Quantity of the product',
    required: true,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class updateQuantityDTO {

  @ApiProperty({
    example: '1',
    description: 'Quantity of the product',
    required: true,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}