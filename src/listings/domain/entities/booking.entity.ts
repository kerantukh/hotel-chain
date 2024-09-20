import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './listing.entity';
import { DateRange } from '../value-objects/date-range.vo';
import { Money } from '../value-objects/money.vo';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing)
  listing: Listing;

  @Column(() => DateRange)
  dateRange: DateRange;

  @Column()
  guestCount: number;

  @Column(() => Money)
  totalPrice: Money;

  @Column()
  createdDate: Date;

  constructor(
    listingId: number,
    dateRange: DateRange,
    guestCount: number,
    totalPrice: Money,
  ) {
    this.listing = { id: listingId } as Listing;
    this.dateRange = dateRange;
    this.guestCount = guestCount;
    this.totalPrice = totalPrice;
    this.createdDate = new Date();
  }
}
