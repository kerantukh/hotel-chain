import { Injectable } from '@nestjs/common';
import { BookingAggregate } from '../aggregates/booking.aggregate';

@Injectable()
export class BookingDomainService {
  validateBooking(bookingAggregate: BookingAggregate): boolean {
    // Здесь мы можем добавить логику валидации бронирования
    // Например, проверка доступности дат, корректности данных и т.д.
    return true;
  }

  // ... другие методы, связанные с бизнес-логикой домена бронирования
}
