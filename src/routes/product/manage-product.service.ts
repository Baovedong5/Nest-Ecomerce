import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repo';
import { CreateProductBodyType, GetManagerProductsQueryType, UpdateProductBodyType } from './product.model';
import { I18nContext } from 'nestjs-i18n';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError } from 'src/shared/helper';
import { RoleName } from 'src/shared/constants/role.constant';

@Injectable()
export class ManageProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  /**
   * Kiểm tra nếu người dùng không phải là người tạo sản phẩm hoặc admin thì không cho tiếp tục
   */
  validatePrivilege({
    userIdRequest,
    roleNameRequest,
    createdById,
  }: {
    userIdRequest: number;
    roleNameRequest: string;
    createdById: number | undefined | null;
  }) {
    if (userIdRequest !== createdById && roleNameRequest !== RoleName.Admin) {
      throw new ForbiddenException();
    }

    return true;
  }

  /**
   * @description: Xem danh sách sản phẩm của 1 shop, bắt buộc phải truyền query param là `CreatedById`
   */

  async list(props: { query: GetManagerProductsQueryType; userIdRequest: number; roleNameRequest: string }) {
    this.validatePrivilege({
      userIdRequest: props.userIdRequest,
      roleNameRequest: props.roleNameRequest,
      createdById: props.query.createdById,
    });

    const data = await this.productRepo.list({
      page: props.query.page,
      limit: props.query.limit,
      languageId: I18nContext.current()?.lang as string,
      createdById: props.query.createdById,
      isPublic: props.query.isPublic,
      brandIds: props.query.brandIds,
      categories: props.query.categories,
      minPrice: props.query.minPrice,
      maxPrice: props.query.maxPrice,
      name: props.query.name,
      orderBy: props.query.orderBy,
      sortBy: props.query.sortBy,
    });

    return data;
  }

  async getDetail(props: { productId: number; userIdRequest: number; roleNameRequest: string }) {
    const product = await this.productRepo.getDetail({
      productId: props.productId,
      languageId: I18nContext.current()?.lang as string,
    });

    if (!product) {
      throw NotFoundRecordException;
    }

    this.validatePrivilege({
      userIdRequest: props.userIdRequest,
      roleNameRequest: props.roleNameRequest,
      createdById: product.createdById,
    });

    return product;
  }

  async create({ createdById, data }: { createdById: number; data: CreateProductBodyType }) {
    return await this.productRepo.create({
      createdById,
      data,
    });
  }

  async update({
    productId,
    updatedById,
    data,
    roleNameRequest,
  }: {
    productId: number;
    updatedById: number;
    data: UpdateProductBodyType;
    roleNameRequest: string;
  }) {
    const product = await this.productRepo.findById(productId);

    if (!product) {
      throw NotFoundRecordException;
    }

    this.validatePrivilege({
      userIdRequest: updatedById,
      roleNameRequest,
      createdById: product.createdById,
    });

    try {
      const updatedProduct = await this.productRepo.update({ id: productId, updatedById, data });

      return updatedProduct;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete({
    productId,
    deletedById,
    roleNameRequest,
  }: {
    productId: number;
    deletedById: number;
    roleNameRequest: string;
  }) {
    const product = await this.productRepo.findById(productId);

    if (!product) {
      throw NotFoundRecordException;
    }

    this.validatePrivilege({
      userIdRequest: deletedById,
      roleNameRequest,
      createdById: product.createdById,
    });

    try {
      await this.productRepo.delete({ id: productId, deletedById });

      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }
}
