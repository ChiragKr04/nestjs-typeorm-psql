import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) {}

  @Post('add')
  async addToCart(@Body() data: CreateCartDto) {
    return await this.cartService.addToCart(
      data.userId,
      data.productId,
      data.quantity,
    );
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return await this.cartService.getCartItems(userId);
  }

  @Patch('update')
  async updateQuantity(@Body() data: UpdateCartDto) {
    return await this.cartService.updateQuantity(
      data.userId,
      data.productId,
      data.quantity,
    );
  }

  @Delete('remove')
  async removeFromCart(@Body() data: { userId: string; productId: string }) {
    return await this.cartService.removeFromCart(data.userId, data.productId);
  }
}
