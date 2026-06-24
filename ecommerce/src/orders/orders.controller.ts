import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { authGuard } from 'src/auth/auth.guard';
import { Roles, RolesGuard } from 'src/guards/roles.guard';

@Controller('orders')
@UseGuards(authGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async createOrder(@Request() req) {
    const userId = req.user.id;
    const order = await this.ordersService.createOrder(userId);
    return order;
  }

  @Get('/mine')
  async listMyOrder(@Request() req) {
    const userId = req.user.id;
    const order = await this.ordersService.listOrder(userId);
    return order;
  }

  @Get()
  @Roles(['admin'])
  async listOrder() {
    const orders = await this.ordersService.listOrders();
    return orders;
  }

  @Get(':id')
  @Roles(['admin'])
  async listOrderById(@Param('id') userId: string) {
    const order = await this.ordersService.listOrder(userId);
    return order;
  }
}
