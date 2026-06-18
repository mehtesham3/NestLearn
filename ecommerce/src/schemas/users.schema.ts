import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  address: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
