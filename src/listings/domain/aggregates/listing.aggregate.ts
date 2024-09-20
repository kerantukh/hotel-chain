import { Listing } from '../entities/listing.entity';
import { Money } from '../value-objects/money.vo';
import { Address } from '../value-objects/address.vo';
import { DateRange } from '../value-objects/date-range.vo';

export class ListingAggregate {
  constructor(private listing: Listing) {}

  updatePrice(newPrice: Money): void {
    this.listing.costPerNight = newPrice;
  }

  updateAvailability(newAvailability: DateRange): void {
    this.listing.availabilityPeriod = newAvailability;
  }

  updateAddress(newAddress: Address): void {
    this.listing.location = newAddress;
  }

  isAvailableForDateRange(dateRange: DateRange): boolean {
    return this.listing.availabilityPeriod.overlaps(dateRange);
  }

  getCostPerNight(): Money {
    return this.listing.costPerNight;
  }

  getListing(): Listing {
    return this.listing;
  }
}
