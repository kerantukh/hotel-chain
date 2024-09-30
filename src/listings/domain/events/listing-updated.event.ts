import { Listing } from '../entities/listing.entity';

export class ListingUpdatedEvent {
  constructor(public listing: Listing) {}
}
