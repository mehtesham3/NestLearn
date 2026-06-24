import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ default: '', trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop()
  category: string;

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

productSchema.index({ category: 1 });
