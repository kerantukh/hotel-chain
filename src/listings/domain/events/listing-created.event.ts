import { Listing } from '../entities/listing.entity';

export class ListingCreatedEvent {
  constructor(public listing: Listing) {}
}
