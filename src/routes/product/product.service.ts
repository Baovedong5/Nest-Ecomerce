import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repo';
import { GetProductsQueryType } from './product.model';
import { I18nContext } from 'nestjs-i18n';
import { NotFoundRecordException } from 'src/shared/error';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async list(props: { query: GetProductsQueryType }) {
    const data = await this.productRepo.list({
      page: props.query.page,
      limit: props.query.limit,
      name: props.query.name,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true,
    });
    return data;
  }

  async getDetail(props: { productId: number }) {
    const product = await this.productRepo.getDetail({
      productId: props.productId,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true,
    });

    if (!product) {
      throw NotFoundRecordException;
    }

    return product;
  }
}
