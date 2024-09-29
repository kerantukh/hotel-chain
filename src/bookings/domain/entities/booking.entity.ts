import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Listing } from 'src/listings/domain/entities/listing.entity';
import { BookingStatus } from '../value-objects/booking-status.vo';
import { BookingDates } from '../value-objects/booking-dates.vo';

/**
 * Сущность "Бронирование"
 */
@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  // Идентификатор бронирования, автоматически генерируется
  id: number;

  @Column()
  // Дата и время бронирования
  bookingDate: Date;

  @ManyToOne(() => User, (user) => user.bookings, {
    cascade: true,
    nullable: false,
  })
  // Пользователь, который сделал бронирование
  user: User;

  @ManyToOne(() => Listing, (listing) => listing.bookings, {
    cascade: true,
    nullable: false,
  })
  // Объявление, которое было забронировано
  listing: Listing;

  @Column(() => BookingDates)
  dates: BookingDates;

  @Column(() => BookingStatus)
  status: BookingStatus;

  @Column({ nullable: true })
  specialRequests: string;
}
