import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ nullable: true })
  imageUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: () => new Date() })
  updatedAt: Date;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const productSchema = SchemaFactory.createForClass(Product);
