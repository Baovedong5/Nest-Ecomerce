import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  CreateReviewBodyDTO,
  CreateReviewResDTO,
  GetReviewDetailParamsDTO,
  GetReviewsDTO,
  GetReviewsParamsDTO,
  UpdateReviewBodyDTO,
  UpdateReviewResDTO,
} from './review.dto';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { IsPublic } from 'src/shared/decorators/auth.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @IsPublic()
  @Get('/products/:productId')
  @ZodResponse({ type: GetReviewsDTO })
  getReviews(@Param() params: GetReviewsParamsDTO, @Query() pagination: PaginationQueryDTO) {
    return this.reviewService.list(params.productId, pagination);
  }

  @Post()
  @ZodResponse({ type: CreateReviewResDTO })
  createReview(@Body() body: CreateReviewBodyDTO, @ActiveUser('userId') userId: number) {
    return this.reviewService.create(userId, body);
  }

  @Put(':reviewId')
  @ZodResponse({ type: UpdateReviewResDTO })
  updateReview(
    @Body() body: UpdateReviewBodyDTO,
    @ActiveUser('userId') userId: number,
    @Param() params: GetReviewDetailParamsDTO,
  ) {
    return this.reviewService.update({
      userId,
      reviewId: params.reviewId,
      body,
    });
  }
}
