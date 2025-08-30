import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  AddToCartBodyDTO,
  CartItemDTO,
  DeleteCartBodyDTO,
  GetCartItemParamsDTO,
  GetCartResDTO,
  UpdateCartItemBodyDTO,
} from './cart.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ZodResponse({ type: GetCartResDTO })
  getCart(@ActiveUser('userId') userId: number, @Query() query: PaginationQueryDTO) {
    return this.cartService.getCart(userId, query);
  }

  @Post()
  @ZodResponse({ type: CartItemDTO })
  addToCart(@Body() body: AddToCartBodyDTO, @ActiveUser('userId') userId: number) {
    return this.cartService.addToCart(userId, body);
  }

  @Put(':cartItemId')
  @ZodResponse({ type: CartItemDTO })
  updateCartItem(
    @Param() params: GetCartItemParamsDTO,
    @Body() body: UpdateCartItemBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.cartService.updateCartItem({ cartItemId: params.cartItemId, body, userId });
  }

  @Post('delete')
  @ZodResponse({ type: MessageResDTO })
  DeleteCartBodyDTO(@Body() body: DeleteCartBodyDTO, @ActiveUser('userId') userId: number) {
    return this.cartService.deleteCartItem(userId, body);
  }
}
