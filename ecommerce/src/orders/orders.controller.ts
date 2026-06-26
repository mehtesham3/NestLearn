import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { authGuard } from 'src/auth/auth.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { statusUpdateDTO } from './DTO/statusUpdate.DTO';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(authGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Create order', description: 'create order from cart' })
  @ApiResponse({ status: 200, description: 'Order created successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createOrder(@Request() req) {
    const userId = req.user.id;
    const order = await this.ordersService.createOrder(userId);
    return order;
  }

  @Get('/mine')
  @ApiOperation({ summary: 'List my orders', description: 'list orders of user' })
  @ApiResponse({ status: 200, description: 'Orders found' })
  @ApiResponse({ status: 404, description: 'Orders not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async listMyOrder(@Request() req) {
    const userId = req.user.id;
    const order = await this.ordersService.listOrder(userId);
    return order;
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel order', description: 'cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async cancelOrder(@Param('id') orderId: string, @Request() req) {
    const userId = req.user.id;
    return this.ordersService.cancelOrder(userId, orderId);
  }

  @Get()
  @Roles(['admin'])
  @ApiOperation({ summary: 'List all orders', description: 'list all orders' })
  @ApiResponse({ status: 200, description: 'Orders found' })
  @ApiResponse({ status: 404, description: 'Orders not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async listOrder() {
    const orders = await this.ordersService.listOrders();
    return orders;
  }

  @Get(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'List order by ID', description: 'list order by ID' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async listOrderById(@Param('id') userId: string) {
    const order = await this.ordersService.listOrder(userId);
    return order;
  }

  @Patch(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Update order status', description: 'update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateStatus(@Param('id') orderId: string, @Body() status: statusUpdateDTO) {
    return this.ordersService.updateStatus(orderId, status);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete order', description: 'delete order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteOrder(@Param('id') orderId: string) {
    return this.ordersService.deleteOrder(orderId);
  }

}
