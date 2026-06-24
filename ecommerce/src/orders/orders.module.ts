import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { orderSchema } from 'src/schemas/order.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CartModule } from 'src/cart/cart.module';
import { ProductsModule } from 'src/products/products.module';
import { userSchema } from 'src/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: orderSchema },
      { name: 'User', schema: userSchema },
    ]),
    AuthModule, //authentication & authorization purpose
    CartModule, //cart convert to order
    ProductsModule, //quantity updtate
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
