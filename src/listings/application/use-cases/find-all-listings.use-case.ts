import { Injectable } from '@nestjs/common';
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';
import { Listing } from 'src/listings/domain/entities/listing.entity';

@Injectable()
export class FindAllListingsUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(): Promise<Listing[]> {
    return this.listingRepository.findAll();
  }
}
