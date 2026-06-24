import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Cart } from 'src/schemas/cart.schema';
import { Product } from 'src/schemas/product.schema';
import { createCartDTO } from './DTO/createCart.DTO';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private cartModel: Model<Cart>,
    @InjectModel('Product') private productModel: Model<Product>,
  ) { }

  async getUserCart(userId: string) {
    const userCart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId), isActive: true })
      .exec();
    if (!userCart || !userCart.isActive)
      throw new NotFoundException(`Cart not found for user with ID: ${userId}`);

    return userCart;
  }

  async createCart(userId: string, cartDto: createCartDTO) {
    const isProductExist = await this.productModel.findById(cartDto.productId);
    if (!isProductExist) throw new NotFoundException(`Product not found `);

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

    await cart.save();

    return cart;
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    if (quantity <= 0)
      throw new BadRequestException('Quantity must be greater than 0');

    const cartExist = await this.cartModel
      .findOne({ userId, isActive: true })
      .exec();

    if (!cartExist) throw new NotFoundException(`Item not found `);

    const isProductExist = cartExist.item.find(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (!isProductExist) throw new NotFoundException(`Item not found `);

    const prodcutUpdate = await this.cartModel
      .findOneAndUpdate(
        { _id: cartExist.id, 'item.productId': productId },
        { $set: { 'item.$.quantity': quantity } },
        { new: true },
      )
      .exec();
    if (!prodcutUpdate) {
      throw new NotFoundException(`Item not found `);
    }
    return prodcutUpdate;
  }

  async deleteCartItem(userId: string, productId: string) {
    const cartExist = await this.cartModel
      .findOne({ userId, isActive: true })
      .exec();
    if (!cartExist) throw new NotFoundException(`Item not found `);

    const deleteCart = await this.cartModel
      .findOneAndUpdate(
        { _id: cartExist.id, 'item.productId': productId },
        { $pull: { item: { productId: productId } } },
        { new: true },
      )
      .exec();
    if (!deleteCart) throw new NotFoundException(`Item not found `);
    return { msg: `Cart with ID: ${cartExist.id} deleted successfully` };
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
    if (!deleteCart) throw new NotFoundException(`Item not found `);
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
