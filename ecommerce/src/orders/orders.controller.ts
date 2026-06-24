import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { authGuard } from 'src/auth/auth.guard';
import { Roles, RolesGuard } from 'src/guards/roles.guard';
import { statusUpdateDTO } from './DTO/statusUpdate.DTO';

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

  @Patch(':id/cancel')
  async cancelOrder(@Param('id') orderId: string, @Request() req) {
    const userId = req.user.id;
    return this.ordersService.cancelOrder(userId, orderId);
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

  @Patch(':id')
  @Roles(['admin'])
  async updateStatus(@Param('id') orderId: string, @Body() status: statusUpdateDTO) {
    return this.ordersService.updateStatus(orderId, status);
  }

  @Delete(':id')
  @Roles(['admin'])
  async deleteOrder(@Param('id') orderId: string) {
    return this.ordersService.deleteOrder(orderId);
  }

}
