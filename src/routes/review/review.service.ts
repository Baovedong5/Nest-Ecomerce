import { Injectable } from '@nestjs/common';
import { ReviewRepo } from './review.repo';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { CreateReviewBodyType, UpdateReviewBodyType } from './review.model';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepo: ReviewRepo) {}

  list(productId: number, pagination: PaginationQueryType) {
    return this.reviewRepo.list(productId, pagination);
  }

  async create(userId: number, body: CreateReviewBodyType) {
    return this.reviewRepo.create(userId, body);
  }

  async update({ userId, reviewId, body }: { userId: number; reviewId: number; body: UpdateReviewBodyType }) {
    return this.reviewRepo.update({ userId, reviewId, body });
  }
}
