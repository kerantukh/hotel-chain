import { BookingAggregate } from '../aggregates/booking.aggregate';

/**
 * Репозиторий для агрегата Booking
 */
export interface BookingRepository {
  /**
   * Сохранить агрегат бронирования
   * @param bookingAggregate - агрегат бронирования для сохранения
   */
  save(bookingAggregate: BookingAggregate): Promise<void>;

  /**
   * Найти агрегат бронирования по ID
   * @param id - идентификатор бронирования
   */
  findById(id: number): Promise<BookingAggregate | null>;
}
