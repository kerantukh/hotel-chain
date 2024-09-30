import { Injectable } from '@nestjs/common';
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';

@Injectable()
export class DeleteListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(listingId: number): Promise<void> {
    await this.listingRepository.delete(listingId);
  }
}
