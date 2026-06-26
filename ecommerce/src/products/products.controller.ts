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
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { updateProductDTO, updateStock } from './DTO/updateProduct.Dto';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('products')
@UseGuards(authGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product',
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Post()
  @Roles(['admin'])
  async createProduct(@Body() productDto: createProductDTO) {
    return this.productsService.createProduct(productDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Get all products',
  })
  @ApiResponse({ status: 200, description: 'All products fetched successfully' })
  @ApiQuery({
    name: 'q', required: false, type: String, description: 'Search products'
  })
  @ApiQuery({
    name: 'category', required: false, type: String, description: 'Filter by category'
  })
  @ApiQuery({
    name: 'page', required: false, type: String, description: 'Page number'
  })
  @ApiQuery({
    name: 'limit', required: false, type: String, description: 'Limit per page'
  })
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
  @ApiOperation({
    summary: 'Get product by id',
    description: 'Get product by id',
  })
  @ApiResponse({ status: 200, description: 'Product fetched successfully' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Public()
  async getProductById(@Param('id') productId: string) {
    return this.productsService.getProductById(productId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update product by id',
    description: 'Update product by id',
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  @Roles(['admin'])
  async updateProductById(
    @Param('id') productId: string,
    @Body() updateProduct: updateProductDTO,
  ) {
    return this.productsService.updateProduct(productId, updateProduct);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product by id',
    description: 'Delete product by id',
  })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  @Roles(['admin'])
  async deleteeProductById(@Param('id') productId: string) {
    return this.productsService.deleteProduct(productId);
  }

  @Patch(':id/stock')
  @ApiOperation({
    summary: 'Update stock by id',
    description: 'Update stock by id',
  })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  @Roles(['admin'])
  async updateStock(
    @Param('id') productId: string,
    @Body() stockUpdate: updateStock,
  ) {
    return this.productsService.updateStock(productId, stockUpdate.stock);
  }
}
