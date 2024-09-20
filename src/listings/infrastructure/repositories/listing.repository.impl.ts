import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';
import { Listing } from 'src/listings/domain/entities/listing.entity';

export class ListingRepositoryImpl implements ListingRepository {
  private listings: Listing[] = [];

  async findAll(): Promise<Listing[]> {
    return this.listings;
  }

  async findById(id: number): Promise<Listing | null> {
    return this.listings.find((listing) => listing.id === id) || null;
  }

  async save(listing: Listing): Promise<Listing> {
    this.listings.push(listing);
    return listing;
  }

  async update(listing: Listing): Promise<Listing> {
    const index = this.listings.findIndex((l) => l.id === listing.id);
    if (index === -1) {
      throw new Error('Listing not found');
    }
    this.listings[index] = listing;
    return listing;
  }

  async delete(id: number): Promise<void> {
    this.listings = this.listings.filter((listing) => listing.id !== id);
  }
}
