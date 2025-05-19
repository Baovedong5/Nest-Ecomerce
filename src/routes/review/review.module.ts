import { Module } from '@nestjs/common';
import { ReviewRepo } from './review.repo';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  providers: [ReviewRepo, ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
