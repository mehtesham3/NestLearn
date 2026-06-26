import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { ProductsService } from 'src/products/products.service';
import { Order, OrderStatus } from 'src/schemas/order.schema';
import { User } from 'src/schemas/users.schema';
import { statusUpdateDTO } from './DTO/statusUpdate.DTO';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('User') private userModel: Model<User>,
    private cartService: CartService,
    private productService: ProductsService,
  ) { }

  private readonly logger = new Logger(OrdersService.name);

  async createOrder(userId: string) {
    const orderCreateStart = Date.now();
    const cart = await this.cartService.getUserCart(userId);
    if (!cart) {
      this.logger.error(`Cart not found for user: ${userId}`);
      throw new NotFoundException('Cart not found for this user');
    }
    if (!cart.item || cart.item.length === 0) {
      this.logger.warn(`Cart is empty for user: ${userId}`);
      throw new BadRequestException('Cart is empty');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.error(`User not found for user: ${userId}`);
      throw new NotFoundException('User not found');
    }

    const orderItems: { productId: any; quantity: any; price: number }[] = [];
    const stockUpdates: { productId: any; newStock: number }[] = [];
    let totalPrice = 0;

    for (const item of cart.item as any) {
      const product = await this.productService.getProductById(item.productId);
      if (!product) {
        this.logger.error(`Product not found for cart item: ${item.productId}`);
        throw new NotFoundException(
          `Product not found for cart item: ${item.productId}`,
        );
      }

      if (product.stock < item.quantity) {
        this.logger.error(`Insufficient stock for product: ${product.name}`);
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      const newStock = product.stock - item.quantity;
      stockUpdates.push({
        productId: item.productId,
        newStock: newStock,
      });

      totalPrice += item.quantity * product.price;
    }

    const newOrder = new this.orderModel({
      userId,
      items: orderItems,
      totalPrice,
      shippingAddress: user.address,
      status: OrderStatus.PENDING,
    });

    // 1. ⚠️ CRITICAL: Use a Transaction to ensure Atomicity (All or Nothing)
    const session = await this.orderModel.db.startSession();
    session.startTransaction();

    try {
      // 1a. Save the order
      const savedOrder = await newOrder.save({ session });

      // 1b. Update product stocks (each with its own new stock value)
      for (const update of stockUpdates) {
        await this.productService.updateStockWithId(
          update.productId,
          update.newStock,
          { session }, // Pass session if your updateStock supports it
        );
      }

      // 1c. Clear the cart (soft delete or empty)
      await this.cartService.clearCart(cart._id.toString(), { session });

      // 1d. Commit transaction
      await session.commitTransaction();
      this.logger.log(`Order created successfully for user: ${userId}`);
      return savedOrder;
    } catch (error) {
      // 1e. Rollback on any error
      await session.abortTransaction();
      this.logger.error(`Order creation failed for user: ${userId}`);
      throw new InternalServerErrorException(
        `Order creation failed: ${error.message}`,
      );
    } finally {
      session.endSession();
      const orderCreateEnd = Date.now();
      const orderCreateTime = orderCreateEnd - orderCreateStart;
      this.logger.log(`Order creation time for user: ${userId}: ${orderCreateTime}ms`);
    }
  }

  async listOrder(userId: string) {
    try {
      const orders = await this.orderModel.find({ userId }).select('-__v').lean();
      if (!orders)
        throw new NotFoundException('No orders found for this user');
      this.logger.log(`Orders listed successfully for user: ${userId}`);
      return orders;
    } catch (error) {
      this.logger.error(`Failed to list orders: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to list orders: ${error.message}`,
      );
    }
  }

  async listOrders() {
    try {
      const orders = await this.orderModel.find().select('-__v').lean();
      if (!orders)
        throw new NotFoundException('No orders found');
      this.logger.log(`Orders listed successfully`);
      return orders;
    } catch (error) {
      this.logger.error(`Failed to list orders: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to list orders: ${error.message}`,
      );
    }
  }

  async cancelOrder(userId: string, orderId: string) {
    const session = await this.orderModel.db.startSession();
    session.startTransaction();

    try {
      const order = await this.orderModel.findOne({ _id: orderId, userId: userId }).session(session);
      if (!order) {
        this.logger.error(`Order with ID: ${orderId} not found`);
        throw new NotFoundException(`Order with ID: ${orderId} not found`);
      }

      // if (order.userId.toString() !== userId) {
      //   console.log(`userId string: ${userId}, order userId : ${order.userId.toString()}`)
      //   throw new ForbiddenException(`You are not authorized to cancel this order`);
      // }

      if (order.status !== OrderStatus.PENDING) {
        this.logger.error(`Order cannot be cancelled as it is already ${order.status}`);
        throw new BadRequestException(`Order cannot be cancelled as it is already ${order.status}`);
      }

      let increaseStock: { productId: any, quantity: number }[] = [];

      for (const item of order.items as any) {
        const product = await this.productService.getProductById(item.productId);
        if (!product) {
          throw new NotFoundException(`Product not found for cart item: ${item.productId}`);
        }
        const newStock = product.stock + item.quantity;

        increaseStock.push({ productId: item.productId, quantity: newStock });
      }

      for (const item of increaseStock as any) {
        await this.productService.updateStockWithId(item.productId, item.quantity, { session });
      }

      const cancelOrder = await this.orderModel.findByIdAndUpdate(orderId, { status: OrderStatus.CANCELLED, isActive: false }, { new: true }).session(session);
      if (!cancelOrder) {
        this.logger.error(`Order with ID: ${orderId} not found`);
        throw new NotFoundException(`Order with ID: ${orderId} not found`);
      }

      await session.commitTransaction();
      this.logger.log(`Order with ID: ${orderId} cancelled successfully`);
      return { msg: "Order cancelled successfully", cancelOrder };

    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`Failed to cancel order: ${error.message}`);
      throw new InternalServerErrorException(`Failed to cancel order: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  async updateStatus(orderid: string, status: statusUpdateDTO) {

    if (status.status === OrderStatus.DELIVERED) {
      const oderUpdate = await this.orderModel.findByIdAndUpdate(orderid, { status: status.status, isActive: false }, { new: true }).lean();
      if (!oderUpdate) {
        this.logger.error(`Order with ID: ${orderid} not found`);
        throw new NotFoundException(`Order with ID: ${orderid} not found`);
      }
      this.logger.log(`Order with ID: ${orderid} updated successfully`);
      return oderUpdate;
    }

    const orderExist = await this.orderModel.findByIdAndUpdate(orderid, { status: status.status, isActive: true }, { new: true }).lean();
    if (!orderExist) {
      this.logger.error(`Order with ID: ${orderid} not found`);
      throw new NotFoundException(`Order with ID: ${orderid} not found`);
    }
    this.logger.log(`Order with ID: ${orderid} updated successfully`);
    return orderExist;
  }

  async deleteOrder(orderId: string) {
    try {

      const orderExist = await this.orderModel.findByIdAndUpdate(orderId, { isActive: false }, { new: true }).lean();
      if (!orderExist) {
        this.logger.error(`Order with ID: ${orderId} not found`);
        throw new NotFoundException(`Order with ID: ${orderId} not found`);
      }
      this.logger.log(`Order with ID: ${orderId} deleted successfully`);
      return { msg: `Order with ID: ${orderId} deleted successfully`, order: orderExist };
    } catch (error) {
      this.logger.error(`Failed to delete order: ${error.message}`);
      throw new InternalServerErrorException(`Failed to delete order: ${error.message}`);
    }
  }

}
