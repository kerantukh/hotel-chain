import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { BookingAggregate } from '../../domain/aggregates/booking.aggregate';

@Injectable()
export class CancelBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(bookingId: number): Promise<void> {
    const bookingAggregate = await this.bookingRepository.findById(bookingId);
    if (!bookingAggregate) {
      throw new Error('Бронирование не найдено');
    }

    bookingAggregate.cancelBooking();
    await this.bookingRepository.save(bookingAggregate);
  }
}
