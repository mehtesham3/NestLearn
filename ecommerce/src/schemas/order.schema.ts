import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export type OrderDocument = mongoose.HydratedDocument<Order>;
@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // price at order time
      },
    ],
    required: true,
  })
  items: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 'pending' })
  status: OrderStatus;

  @Prop({ type: String, default: null })
  paymentMethod: string;

  @Prop({ type: String, default: null })
  shippingAddress: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: () => new Date() })
  updatedAt: Date;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const orderSchema = SchemaFactory.createForClass(Order);
