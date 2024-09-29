import { Booking } from '../entities/booking.entity';
import { BookingDates } from '../value-objects/booking-dates.vo';
import { BookingStatus } from '../value-objects/booking-status.vo';

/**
 * Агрегатный корень для бронирования
 */
export class BookingAggregate {
  private booking: Booking;

  constructor(booking: Booking) {
    this.booking = booking;
  }

  // Метод для отмены бронирования
  cancelBooking() {
    if (this.booking.status.getStatus() === 'cancelled') {
      throw new Error('Бронирование уже отменено.');
    }
    this.booking.status = new BookingStatus('cancelled');
    // Дополнительная логика отмены бронирования
  }

  // Метод для подтверждения бронирования
  confirmBooking() {
    if (this.booking.status.getStatus() === 'confirmed') {
      throw new Error('Бронирование уже подтверждено.');
    }
    this.booking.status = new BookingStatus('confirmed');
    // Дополнительная логика подтверждения бронирования
  }

  // Метод для изменения дат бронирования
  changeDates(newStartDate: Date, newEndDate: Date) {
    if (newEndDate <= newStartDate) {
      throw new Error('Дата окончания должна быть позже даты начала.');
    }
    this.booking.dates = new BookingDates(newStartDate, newEndDate);
    // Дополнительная логика изменения дат
  }

  // Метод для добавления специальных запросов
  addSpecialRequests(requests: string) {
    this.booking.specialRequests = requests;
    // Дополнительная логика обработки специальных запросов
  }

  // Геттер для доступа к сущности бронирования
  getBooking(): Booking {
    return this.booking;
  }

  // Метод для получения статуса бронирования
  getStatus(): string {
    return this.booking.status.getStatus();
  }

  // Метод для получения дат бронирования
  getDates(): { startDate: Date; endDate: Date } {
    return {
      startDate: this.booking.dates.getStartDate(),
      endDate: this.booking.dates.getEndDate(),
    };
  }
}
