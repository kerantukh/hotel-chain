import { Injectable } from '@nestjs/common';
import { BookingDomainService } from '../../domain/services/booking.domain.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { Booking } from '../../domain/entities/booking.entity';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private readonly bookingDomainService: BookingDomainService,
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Использование доменного сервиса для создания бронирования
    const newBooking =
      this.bookingDomainService.createBooking(createBookingDto);

    // Сохранение бронирования в репозитории
    const savedBooking = await this.bookingRepository.save(newBooking);

    return savedBooking;
  }
}
