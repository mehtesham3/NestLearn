import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Types } from 'mongoose';

export class createCartDTO {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
