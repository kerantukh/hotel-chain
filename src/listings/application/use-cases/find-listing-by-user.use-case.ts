import { Injectable } from '@nestjs/common';
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';
import { Listing } from 'src/listings/domain/entities/listing.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FindListingsByUserUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(user: User): Promise<Listing[]> {
    return this.listingRepository.findByUser(user);
  }
}
