import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { createProductDTO } from './DTO/createProduct.Dto';
import { NotFoundError } from 'rxjs';
import { updateProductDTO, updateStock } from './DTO/updateProduct.Dto';
import { ClientSession } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) { }

  private readonly logger = new Logger(ProductsService.name)

  async createProduct(
    createProduct: createProductDTO,
  ): Promise<Omit<Product, '__v'>> {
    const existingProduct = await this.productModel.findOne({
      name: { $regex: new RegExp(`^${createProduct.name}$`, 'i') }, // Case-insensitive
    });

    if (existingProduct) {
      this.logger.error(`Product with name "${createProduct.name}" already exists`);
      throw new ConflictException(
        `Product with name "${createProduct.name}" already exists`,
      );
    }
    const productDetail = {
      name: createProduct.name,
      description: createProduct.description,
      price: createProduct.price,
      stock: createProduct.stock,
      category: createProduct.category,
      imageUrl:
        createProduct.imageUrl ||
        'https://i0.wp.com/www.gktoday.in/wp-content/uploads/2016/04/Product-in-Marketing.png?ssl=1',
    };
    try {
      const createdProduct = await this.productModel.create(productDetail);

      // 5. Return clean object (exclude __v)
      const { __v, ...productWithoutVersion } = createdProduct.toObject();
      this.logger.log(`Product created successfully: ${productWithoutVersion.name}`);
      return productWithoutVersion;
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw new BadRequestException(
        `Failed to create product: ${error.message}`,
      );
    }
  }

  // : Promise<{
  // msg: string;
  // products: Product[];
  // }>
  async getAllProducts(filters: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const query: any = { isActive: true };

      // 🔍 Search
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
        ];
      }

      // 📁 Category filter
      if (filters.category) {
        query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
      }

      // 📄 Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      // 🚀 Parallel queries
      const [products, total] = await Promise.all([
        this.productModel
          .find(query)
          .select('-__v')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.productModel.countDocuments(query),
      ]);
      this.logger.log(`Products fetched successfully`);
      return {
        msg: 'Products fetched successfully',
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to fetch product: ${error.message}`);
      throw new BadRequestException(
        `Failed to fetch product: ${error.message}`,
      );
    }
  }

  async getProductById(productId: string) {
    try {
      const product = await this.productModel.findById(productId).lean();

      if (!product || !product.isActive) {
        this.logger.error(`Product with id : ${productId} not found`);
        throw new NotFoundException(`Product with id : ${productId} not found`);
      }
      this.logger.log(`Product fetched successfully`);
      const { isActive, __v, ...productWithBasicInfo } = product;
      return productWithBasicInfo;
    } catch (error) {
      this.logger.error(`Failed to fetch product: ${error.message}`);
      throw new BadRequestException(
        `Failed to fetch product: ${error.message}`,
      );
    }
  }

  async updateProduct(productId: string, updateProduct: updateProductDTO) {
    let updateDetails: any = {
      name: updateProduct.name,
      description: updateProduct.description,
      price: updateProduct.price,
      stock: updateProduct.stock,
      category: updateProduct.category,
      imageUrl: updateProduct.imageUrl,
      updatedAt: Date.now(),
    };

    //remove undefined details
    Object.keys(updateDetails).forEach(
      (key) => updateDetails[key] === undefined && delete updateDetails[key],
    );

    try {
      const updateItem = await this.productModel
        .findByIdAndUpdate(productId, updateDetails, { new: true })
        .select('-__v');
      if (!updateItem) {
        this.logger.error(`Product with id: ${productId} not found`);
        throw new NotFoundException(`Product with id: ${productId} not found`);
      }
      this.logger.log(`Product updated successfully`);
      return { msg: 'Product updated', updateItem };
    } catch (error) {
      this.logger.error(`Failed to update product: ${error.message}`);
      throw new BadRequestException(
        `Failed to update product: ${error.message}`,
      );
    }
  }

  async deleteProduct(productId: string) {
    try {
      const update = {
        isActive: false,
      };
      const delProduct = await this.productModel.findByIdAndUpdate(
        productId,
        update,
        {
          new: true,
        },
      );

      if (!delProduct) {
        this.logger.error(`Product with id: ${productId} not found`);
        throw new NotFoundException(`Product with id: ${productId} not found`);
      }
      this.logger.log(`Product deleted successfully`);
      return { msg: ' Product soft deleted', delProduct };
    } catch (error) {
      this.logger.error(`Failed to delete product: ${error.message}`);
      throw new BadRequestException(
        `Failed to delete product: ${error.message}`,
      );
    }
  }

  async updateStock(productId: string, stock: number) {
    try {
      const updateStock = {
        stock: stock,
        updatedAt: Date.now(),
      };
      const update = await this.productModel
        .findByIdAndUpdate(productId, updateStock, { new: true })
        .select('-__v -description');

      if (!update) {
        this.logger.error(`Product with id: ${productId} not found`);
        throw new NotFoundException(`Product with id: ${productId} not found`);
      }
      this.logger.log(`Stock updated successfully`);
      return {
        msg: `Stock updated sucessfully time : ${update.updatedAt.toUTCString()}`,
        updateStock: update,
      };
    } catch (error) {
      this.logger.error(`Failed to update stock: ${error.message}`);
      throw new BadRequestException(`Failed to update stock: ${error.message}`);
    }
  }
  async updateStockWithId(
    productId: string,
    newStock: number,
    options?: { session?: ClientSession },
  ) {
    // Validate stock
    if (newStock < 0) {
      this.logger.error(`Stock cannot be negative (session used)`);
      throw new BadRequestException('Stock cannot be negative');
    }

    // Find and update with session
    const product = await this.productModel
      .findByIdAndUpdate(
        productId,
        { stock: newStock },
        {
          new: true,
          runValidators: true,
          session: options?.session || null,
        },
      )
      .exec();

    if (!product) {
      this.logger.error(`Product with id: ${productId} not found (session used)`);
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    this.logger.log(`Stock updated successfully (session used)`);

    return product;
  }
}
