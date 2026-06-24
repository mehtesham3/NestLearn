import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { cartSchema } from 'src/schemas/cart.schema';
import { AuthModule } from 'src/auth/auth.module';
import { productSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Cart', schema: cartSchema },
      { name: 'Product', schema: productSchema },
    ]),
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
