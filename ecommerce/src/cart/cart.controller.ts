import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { authGuard } from 'src/auth/auth.guard';
import { createCartDTO } from './DTO/createCart.DTO';
@Controller('cart')
@UseGuards(authGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    const userId = req.user.id;
    const cart = await this.cartService.getUserCart(userId);
    return cart;
  }

  @Post('/add')
  async addToCart(@Request() req, @Body() cartDto: createCartDTO) {
    const userId = req.user.id;
    const cart = await this.cartService.createCart(userId, cartDto);
    return cart;
  }

  @Put('/update/:productId')
  async updateQuantity(
    @Request() req,
    @Body('quantity') quantity: number,
    @Param('productId') productId: string,
  ) {
    const userId = req.user.id;
    const updatedCart = await this.cartService.updateQuantity(
      userId,
      productId,
      quantity,
    );
    return updatedCart;
  }

  @Delete('/remove/:productId')
  async removeProduct(@Request() req, @Param('productId') productId: string) {
    const userId = req.user.id;
    const deleteCart = await this.cartService.deleteCartItem(userId, productId);
    return deleteCart;
  }

  @Delete('/emptyCart')
  async emptyCart(@Request() req) {
    const userId = req.user.id;
    const deleteCart = await this.cartService.deleteEntireCart(userId);
    return deleteCart;
  }
}
