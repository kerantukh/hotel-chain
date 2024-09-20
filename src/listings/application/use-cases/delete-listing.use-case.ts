import { Injectable } from '@nestjs/common';
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';

@Injectable()
export class DeleteListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(id: number): Promise<void> {
    const listing = await this.listingRepository.findById(id);
    if (!listing) {
      throw new Error('Объект размещения не найден');
    }

    await this.listingRepository.delete(id);
  }
}
