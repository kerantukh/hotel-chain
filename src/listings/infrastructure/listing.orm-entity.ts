import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from 'src/listings/domain/entities/listing.entity';
import { User } from 'src/users/entities/user.entity';
import { Address } from '../domain/value-objects/address.vo';
import { Money } from '../domain/value-objects/money.vo';
import { Score } from '../domain/value-objects/score.vo';
import { DateRange } from '../domain/value-objects/date-range.vo';
import { Currency } from '../domain/value-objects/currency.vo';
import { Coordinates } from '../domain/value-objects/coordinates.vo';
import { Photo } from '../domain/value-objects/photo.vo';
@Entity('listings')
export class ListingOrmEntity extends Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column((type) => Address)
  location: Address;

  @Column((type) => Money)
  costPerNight: Money;

  @Column()
  roomCount: number;

  @Column()
  guestLimit: number;

  @Column((type) => Score)
  score: Score;

  @Column()
  isAvailable: boolean;

  @Column('simple-array')
  features: string[];

  @Column((type) => DateRange)
  availabilityPeriod: DateRange;

  @Column()
  createdDate: Date;

  @Column()
  modifiedDate: Date;

  @Column()
  isDeleted: boolean;

  @Column((type) => Currency)
  currency: Currency;

  @Column((type) => Coordinates)
  coordinates: Coordinates;

  @Column((type) => Photo)
  images: Photo[];

  @ManyToOne(() => User, (user) => user.listings, { nullable: false })
  user: User;
}
