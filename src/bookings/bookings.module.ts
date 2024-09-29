import { Module } from '@nestjs/common';
import { BookingsController } from './interface/bookings.controller';
@Module({
  imports: [],
  controllers: [BookingsController],
  providers: [],
})
export class BookingsModule {}
