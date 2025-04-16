import { Injectable } from '@nestjs/common';
import { SKUSchemaType } from 'src/shared/models/shared-sku.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import { NotFoundSKUException, OutOfStockSKUException, ProductNotFoundException } from './cart.error';
import {
  AddToCartBodyType,
  CartItemType,
  DeleteCartBodyType,
  GetCartResType,
  UpdateCartItemBodyType,
} from './cart.model';
import { ALL_LANGUAGES_CODE } from 'src/shared/constants/other.constant';

@Injectable()
export class CartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Lấy thông tin SKU từ DB
   * @param skuId
   * @returns
   */
  private async validateSKU(skuId: number): Promise<SKUSchemaType> {
    const sku = await this.prismaService.sKU.findUnique({
      where: {
        id: skuId,
        deletedAt: null,
      },
      include: {
        product: true,
      },
    });

    // Kiểm tra tồn tại SKU
    if (!sku) {
      throw NotFoundSKUException;
    }

    // Kiểm tra lượng hàng còn lại
    if (sku.stock < 1) {
      throw OutOfStockSKUException;
    }

    const { product } = sku;

    // Kiểm tra sản phẩm đã bị xóa hoặc có công khai hay không
    if (
      product.deletedAt !== null ||
      product.publishedAt === null ||
      (product.publishedAt !== null && product.publishedAt > new Date())
    ) {
      throw ProductNotFoundException;
    }

    return sku;
  }

  async findAll({
    userId,
    languageId,
    page,
    limit,
  }: {
    userId: number;
    languageId: string;
    page: number;
    limit: number;
  }): Promise<GetCartResType> {
    const skip = (page - 1) * limit;
    const take = limit;

    const [totalItems, data] = await Promise.all([
      this.prismaService.cartItem.count({
        where: { userId },
      }),
      this.prismaService.cartItem.findMany({
        where: {
          userId,
        },
        include: {
          sku: {
            include: {
              product: {
                include: {
                  productTranslations: {
                    where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
                  },
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data,
    };
  }

  async create(userId: number, body: AddToCartBodyType): Promise<CartItemType> {
    await this.validateSKU(body.skuId);

    return this.prismaService.cartItem.create({
      data: {
        userId,
        skuId: body.skuId,
        quantity: body.quantity,
      },
    });
  }

  async update(cartItemId: number, body: UpdateCartItemBodyType): Promise<CartItemType> {
    await this.validateSKU(body.skuId);

    return this.prismaService.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        skuId: body.skuId,
        quantity: body.quantity,
      },
    });
  }

  delete(userId: number, body: DeleteCartBodyType): Promise<{ count: number }> {
    return this.prismaService.cartItem.deleteMany({
      where: {
        id: {
          in: body.cartItemIds,
        },
        userId,
      },
    });
  }
}
