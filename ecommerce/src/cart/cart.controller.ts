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
import { createCartDTO, updateQuantityDTO } from './DTO/createCart.DTO';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('cart')
@UseGuards(authGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('/add')
  @ApiOperation({ summary: 'Add to cart', description: 'add product to cart' })
  @ApiResponse({ status: 200, description: 'Cart found' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async addToCart(@Request() req, @Body() cartDto: createCartDTO) {
    const userId = req.user.id;
    const cart = await this.cartService.createCart(userId, cartDto);
    return cart;
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart', description: 'get user cart with product ids' })
  @ApiResponse({ status: 200, description: 'Cart found' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCart(@Request() req) {
    const userId = req.user.id;
    const cart = await this.cartService.getUserCart(userId);
    return cart;
  }

  @Put('/update/:productId')
  @ApiOperation({ summary: 'Update quantity', description: 'update quantity of product in cart' })
  @ApiResponse({ status: 200, description: 'Cart found' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async updateQuantity(
    @Request() req,
    @Body() qData: updateQuantityDTO,
    @Param('productId') productId: string,
  ) {
    const userId = req.user.id;
    const updatedCart = await this.cartService.updateQuantity(
      userId,
      productId,
      qData,
    );
    return updatedCart;
  }

  @Delete('/remove/:productId')
  @ApiOperation({ summary: 'Remove product', description: 'remove product from cart' })
  @ApiResponse({ status: 200, description: 'Cart found' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async removeProduct(@Request() req, @Param('productId') productId: string) {
    const userId = req.user.id;
    const deleteCart = await this.cartService.deleteCartItem(userId, productId);
    return deleteCart;
  }

  @Delete('/emptyCart')
  @ApiOperation({ summary: 'Empty cart', description: 'empty cart' })
  @ApiResponse({ status: 200, description: 'Cart found' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async emptyCart(@Request() req) {
    const userId = req.user.id;
    const deleteCart = await this.cartService.deleteEntireCart(userId);
    return deleteCart;
  }
}
