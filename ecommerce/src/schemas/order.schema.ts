import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './users.schema';

export type OrderDocument = mongoose.HydratedDocument<Order>;
@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  cartId: mongoose.Types.ObjectId;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: () => new Date() })
  updatedAt: Date;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const orderSchema = SchemaFactory.createForClass(Order);
