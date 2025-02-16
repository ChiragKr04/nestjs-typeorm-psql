import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productModel: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<any> {
    try {
      const price = createProductDto.price;
      delete createProductDto.price;
      const product = this.productModel.create({
        ...createProductDto,
        excl_tax_price: price,
      });
      await this.productModel.save(product);
      return {
        product,
        message: 'Product created successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async findAll(): Promise<any> {
    try {
      const products = await this.productModel.find({
        order: { createdAt: 'DESC' },
      });
      return {
        data: products,
        message: 'Products retrieved successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException('Invalid ID provided', id);
      }
      const product = await this.productModel.findOne({
        where: { id: id },
      });
      if (!product) {
        throw new BadRequestException(
          'Product not found with the provided ID',
          id,
        );
      }
      return {
        data: product,
        message: 'Product retrieved successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<any> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException('Invalid ID provided', id);
      }
      let product = await this.productModel.findOne({
        where: { id: id },
      });
      if (!product) {
        throw new BadRequestException(
          'Product not found with the provided ID',
          id,
        );
      }
      const price = updateProductDto?.price;
      delete updateProductDto?.price;
      Object.assign(product, {
        ...updateProductDto,
        excl_tax_price: price,
      });
      product = await this.productModel.save(product);
      return {
        data: product,
        message: 'Product updated successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
