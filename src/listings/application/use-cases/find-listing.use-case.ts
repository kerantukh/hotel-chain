import { Injectable } from '@nestjs/common';
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';
import { Listing } from '../../domain/entities/listing.entity';

@Injectable()
export class FindListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(id: number): Promise<Listing> {
    const listing = await this.listingRepository.findById(id);
    if (!listing) {
      throw new Error('Листинг не найден');
    }
    return listing;
  }
}
