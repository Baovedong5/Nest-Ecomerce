import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repo';
import { CreateOrderBodyType, GetOrderListQueryType } from './order.model';
import { OrderProducer } from './order.producer';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly orderProducer: OrderProducer,
  ) {}

  list(userId: number, query: GetOrderListQueryType) {
    return this.orderRepo.list(userId, query);
  }

  async create(userId: number, body: CreateOrderBodyType) {
    const result = await this.orderRepo.create(userId, body);

    return result;
  }

  detail(userId: number, orderId: number) {
    return this.orderRepo.detail(userId, orderId);
  }

  cancel(userId: number, orderId: number) {
    return this.orderRepo.cancel(userId, orderId);
  }
}
