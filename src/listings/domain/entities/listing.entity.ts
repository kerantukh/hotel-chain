import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Money } from '../value-objects/money.vo';
import { Address } from '../value-objects/address.vo';
import { DateRange } from '../value-objects/date-range.vo';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column(() => Address)
  location: Address;

  @Column(() => Money)
  costPerNight: Money;

  @Column()
  roomCount: number;

  @Column()
  guestLimit: number;

  @Column()
  score: number;

  @Column()
  isAvailable: boolean;

  @Column('simple-array')
  features: string[];

  @Column(() => DateRange)
  availabilityPeriod: DateRange;

  @Column()
  createdDate: Date;

  @Column()
  modifiedDate: Date;

  updateAvailability(newAvailabilityPeriod: DateRange): void {
    this.availabilityPeriod = newAvailabilityPeriod;
    this.modifiedDate = new Date();
  }

  updatePrice(newPrice: Money): void {
    this.costPerNight = newPrice;
    this.modifiedDate = new Date();
  }

  updateLocation(newAddress: Address): void {
    this.location = newAddress;
    this.modifiedDate = new Date();
  }

  updateDetails(
    name: string,
    description: string,
    roomCount: number,
    guestLimit: number,
  ): void {
    this.name = name;
    this.description = description;
    this.roomCount = roomCount;
    this.guestLimit = guestLimit;
    this.modifiedDate = new Date();
  }

  updateFeatures(features: string[]): void {
    this.features = features;
    this.modifiedDate = new Date();
  }

  setAvailability(isAvailable: boolean): void {
    this.isAvailable = isAvailable;
    this.modifiedDate = new Date();
  }

  updateScore(newScore: number): void {
    if (newScore < 0 || newScore > 5) {
      throw new Error('Оценка должна быть от 0 до 5');
    }
    this.score = newScore;
    this.modifiedDate = new Date();
  }
}
