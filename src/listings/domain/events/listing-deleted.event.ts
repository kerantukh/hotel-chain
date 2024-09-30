import { Listing } from '../entities/listing.entity';

export class ListingDeletedEvent {
  constructor(public listing: Listing) {}
}
