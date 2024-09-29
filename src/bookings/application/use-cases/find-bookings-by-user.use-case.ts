import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { BookingAggregate } from '../../domain/aggregates/booking.aggregate';

@Injectable()
export class FindBookingsByUserUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  // Метод для поиска бронирований по ID пользователя
  async execute(userId: number): Promise<BookingAggregate[]> {
    // Реализуйте метод поиска бронирований по userId
    // Это может потребовать добавления соответствующего метода в репозиторий
    const bookings = await this.bookingRepository.findByUserId(userId);
    return bookings; // Возврат найденных бронирований
  }
}
