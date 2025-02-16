import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartModel: Repository<Cart>,
  ) {}

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    try {
      // Check if item already exists in cart
      let cartItem = await this.cartModel.findOne({
        where: {
          userId,
          productId,
        },
      });

      if (cartItem) {
        // Update quantity if item exists
        cartItem.quantity += quantity;
      } else {
        // Create new cart item if it doesn't exist
        cartItem = this.cartModel.create({
          userId,
          productId,
          quantity,
        });
      }

      return await this.cartModel.save(cartItem);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async getCartItems(userId: string): Promise<any> {
    try {
      const cartData = await this.cartModel.find({
        where: { userId },
        relations: ['product'],
      });

      const totals = await this.cartModel
        .createQueryBuilder('cart')
        .leftJoin('cart.product', 'product')
        .where('cart.userId = :userId', { userId })
        .select([
          'CAST(SUM(cart.quantity) as INTEGER) AS totalQuantity',
          'SUM(product.incl_tax_price * cart.quantity) AS totalPrice',
          'CAST(COUNT(cart.id) as INTEGER) AS totalItems',
        ])
        .getRawOne();

      return {
        data: {
          cart: cartData,
          totals: totals,
        },
        message: 'Cart items retrieved successfully',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<any> {
    try {
      const cartItem = await this.cartModel.findOne({
        where: {
          userId,
          productId,
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }

      cartItem.quantity = quantity;
      const data = await this.cartModel.save(cartItem);

      return await this.getCartItems(userId);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await this.cartModel.delete({
      userId,
      productId,
    });
  }
}
