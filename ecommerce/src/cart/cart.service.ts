import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Cart } from 'src/schemas/cart.schema';
import { Product } from 'src/schemas/product.schema';
import { createCartDTO, updateQuantityDTO } from './DTO/createCart.DTO';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private cartModel: Model<Cart>,
    @InjectModel('Product') private productModel: Model<Product>,
  ) { }

  private readonly logger = new Logger(CartService.name);

  async getUserCart(userId: string) {
    const start = performance.now();
    this.logger.log(`Fetching cart for user: ${userId}`);
    const userCart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId), isActive: true })
      .exec();
    if (!userCart || !userCart.isActive) {
      const end = performance.now();
      this.logger.log(`Cart not found for user with ID: ${userId} in ${end - start}ms`);
      throw new NotFoundException(`Cart not found for user with ID: ${userId}`);
    }
    const end = performance.now();
    this.logger.log(`Cart found for user: ${userId} in ${end - start}ms`);
    return userCart;
  }

  async createCart(userId: string, cartDto: createCartDTO) {
    const start = performance.now();
    this.logger.log(`Creating cart for user: ${userId}`);
    const isProductExist = await this.productModel.findById(cartDto.productId);
    if (!isProductExist) {
      const end = performance.now();
      this.logger.log(`Product not found in ${end - start}ms`);
      throw new NotFoundException(`Product not found `);
    }
    this.logger.log(`Product found in ${performance.now() - start}ms`);
    let cart = await this.cartModel.findOne({ userId, isActive: true }).exec();
    if (!cart) {
      cart = new this.cartModel({ userId, items: [] }); //create a new cart for the user
    }
    const existingItemIndex = cart.item.findIndex(
      (item) => item.productId.toString() === cartDto.productId.toString(),
    );

    if (existingItemIndex > -1) {
      cart.item[existingItemIndex].quantity += cartDto.quantity;
    } else {
      cart.item.push({
        productId: cartDto.productId,
        quantity: cartDto.quantity,
      });
    }
    this.logger.log(`Cart created in ${performance.now() - start}ms`);

    await cart.save();
    this.logger.log(`Cart saved for userId: ${userId} `);
    return cart;
  }

  async updateQuantity(userId: string, productId: string, quantityData: updateQuantityDTO) {

    if (quantityData.quantity <= 0)
      throw new BadRequestException('Quantity must be greater than 0');
    const cartExist = await this.cartModel
      .findOne({ userId, isActive: true })
      .exec();

    if (!cartExist) {
      this.logger.error(`Cart not found for user with ID: ${userId}`);
      throw new NotFoundException(`Item not found `);
    }

    const isProductExist = cartExist.item.find(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (!isProductExist) throw new NotFoundException(`Item not found `);

    const prodcutUpdate = await this.cartModel
      .findOneAndUpdate(
        { _id: cartExist.id, 'item.productId': productId },
        { $set: { 'item.$.quantity': quantityData.quantity } },
        { new: true },
      )
      .exec();
    if (!prodcutUpdate) {
      this.logger.error(`Product not found in cart for user with ID: ${userId}`);
      throw new NotFoundException(`Item not found `);
    }
    this.logger.log(`Quantity updated for user: ${userId}`);
    return prodcutUpdate;
  }

  async deleteCartItem(userId: string, productId: string) {
    const cartExist = await this.cartModel
      .findOne({ userId, isActive: true })
      .exec();
    if (!cartExist) {
      this.logger.error(`Cart not found for user with ID: ${userId}`);
      throw new NotFoundException(`Item not found `);
    }

    const deleteCart = await this.cartModel
      .findOneAndUpdate(
        { _id: cartExist.id, 'item.productId': productId },
        { $pull: { item: { productId: productId } } },
        { new: true },
      )
      .exec();
    if (!deleteCart) {
      this.logger.error(`Product not found in cart for user with ID: ${userId}`);
      throw new NotFoundException(`Item not found `);
    }
    this.logger.log(`Product deleted for user: ${userId}`);
    return { msg: `Item removed from cart successfully Productid : ${productId}` };
  }

  async deleteEntireCart(userId: string) {
    const cartExist = await this.cartModel
      .findOne({ userId, isActive: true })
      .exec();
    if (!cartExist) throw new NotFoundException(`Item not found `);

    const deleteCart = await this.cartModel
      .findOneAndUpdate(
        { _id: cartExist.id },
        { $set: { isActive: false } },
        { new: true },
      )
      .exec();
    if (!deleteCart) {
      this.logger.error(`Cart not found for user with ID: ${userId}`);
      throw new NotFoundException(`Item not found `);
    }
    this.logger.log(`Cart deleted for user: ${userId}`);
    return { msg: `Cart with ID: ${cartExist.id} deleted successfully` };
  }

  async clearCart(cartId: string, options?: { session?: ClientSession }) {
    const session = options?.session || null;
    await this.cartModel
      .findByIdAndUpdate(
        cartId,
        { isActive: false },
        { new: true, session },
      )
      .exec();
  }
}
