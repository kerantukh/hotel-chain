import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingAggregate } from '../../domain/aggregates/booking.aggregate';
import { BookingRepository } from '../../domain/repositories/booking.repository';

@Injectable()
export class TypeOrmBookingRepository implements BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  // Метод для сохранения агрегата бронирования
  async save(bookingAggregate: BookingAggregate): Promise<void> {
    await this.bookingRepo.save(bookingAggregate.getBooking());
  }

  // Метод для поиска агрегата бронирования по ID
  async findById(id: number): Promise<BookingAggregate | null> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'listing'],
    });
    if (!booking) {
      return null;
    }
    return new BookingAggregate(booking);
  }
}
