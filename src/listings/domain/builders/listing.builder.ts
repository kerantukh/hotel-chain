import { Listing } from '../entities/listing.entity';
import { Money } from '../value-objects/money.vo';
import { Address } from '../value-objects/address.vo';
import { DateRange } from '../value-objects/date-range.vo';

// Абстрактный builder
export abstract class AbstractListingBuilder {
  protected listing: Listing;

  constructor() {
    this.listing = new Listing();
    this.listing.createdDate = new Date();
    this.listing.modifiedDate = new Date();
    this.listing.isAvailable = true;
    this.listing.score = 0;
  }

  abstract withName(name: string): AbstractListingBuilder;
  abstract withDescription(description: string): AbstractListingBuilder;
  abstract withLocation(
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
  ): AbstractListingBuilder;
  abstract withCostPerNight(
    amount: number,
    currency: string,
  ): AbstractListingBuilder;
  abstract withRoomCount(roomCount: number): AbstractListingBuilder;
  abstract withGuestLimit(guestLimit: number): AbstractListingBuilder;
  abstract withFeatures(features: string[]): AbstractListingBuilder;
  abstract withAvailabilityPeriod(
    startDate: Date,
    endDate: Date,
  ): AbstractListingBuilder;
  abstract build(): Listing;
}

// Конкретный builder
export class ConcreteListingBuilder extends AbstractListingBuilder {
  withName(name: string): ConcreteListingBuilder {
    this.listing.name = name;
    return this;
  }

  withDescription(description: string): ConcreteListingBuilder {
    this.listing.description = description;
    return this;
  }

  withLocation(
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
  ): ConcreteListingBuilder {
    this.listing.location = new Address(street, city, state, country, zipCode);
    return this;
  }

  withCostPerNight(amount: number, currency: string): ConcreteListingBuilder {
    this.listing.costPerNight = new Money(amount, currency);
    return this;
  }

  withRoomCount(roomCount: number): ConcreteListingBuilder {
    this.listing.roomCount = roomCount;
    return this;
  }

  withGuestLimit(guestLimit: number): ConcreteListingBuilder {
    this.listing.guestLimit = guestLimit;
    return this;
  }

  withFeatures(features: string[]): ConcreteListingBuilder {
    this.listing.features = features;
    return this;
  }

  withAvailabilityPeriod(
    startDate: Date,
    endDate: Date,
  ): ConcreteListingBuilder {
    this.listing.availabilityPeriod = new DateRange(startDate, endDate);
    return this;
  }

  build(): Listing {
    return this.listing;
  }
}
