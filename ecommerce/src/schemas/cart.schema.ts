import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './users.schema';
import { Types } from 'mongoose';

export type CartDocument = mongoose.HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      }
    ],
    default: [],
    required: true,
    _id: false, // Prevents Mongoose from generating an unnecessary '_id' for this sub-object
  })
  item: {
    productId: mongoose.Types.ObjectId | string;
    quantity: number;
  }[];

  @Prop({ default: true })
  isActive: boolean;
}

export const cartSchema = SchemaFactory.createForClass(Cart);
