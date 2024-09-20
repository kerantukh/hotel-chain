import { Listing } from '../entities/listing.entity';

export abstract class ListingRepository {
  abstract findAll(): Promise<Listing[]>;
  abstract findById(id: number): Promise<Listing | null>;
  abstract save(listing: Listing): Promise<Listing>;
  abstract update(listing: Listing): Promise<Listing>;
  abstract delete(id: number): Promise<void>;
}
