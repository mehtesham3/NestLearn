import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { createProductDTO } from './DTO/createProduct.Dto';
import { authGuard, Public } from 'src/auth/auth.guard';
import { Roles, RolesGuard } from 'src/guards/roles.guard';
import { updateProductDTO, updateStock } from './DTO/updateProduct.Dto';

@Controller('products')
@UseGuards(authGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(['admin'])
  async createProduct(@Body() productDto: createProductDTO) {
    return this.productsService.createProduct(productDto);
  }

  @Get()
  @Public()
  async getAllProduct(
    @Query('q') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.getAllProducts({
      search,
      category,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
  }

  @Get(':id')
  @Public()
  async getProductById(@Param('id') productId: string) {
    return this.productsService.getProductById(productId);
  }

  @Put(':id')
  @Roles(['admin'])
  async updateProductById(
    @Param('id') productId: string,
    @Body() updateProduct: updateProductDTO,
  ) {
    return this.productsService.updateProduct(productId, updateProduct);
  }

  @Delete(':id')
  @Roles(['admin'])
  async deleteeProductById(@Param('id') productId: string) {
    return this.productsService.deleteProduct(productId);
  }

  @Patch(':id/stock')
  @Roles(['admin'])
  async updateStock(
    @Param('id') productId: string,
    @Body() stockUpdate: updateStock,
  ) {
    return this.productsService.updateStock(productId, stockUpdate.stock);
  }
}
