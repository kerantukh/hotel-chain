import { Injectable } from '@nestjs/common';
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';
import { Listing } from '../../domain/entities/listing.entity';
import { UpdateListingDto } from 'src/listings/application/dto/update-listing.dto';
import { ListingDomainService } from '../../domain/services/listing.domain.service';

@Injectable()
export class UpdateListingUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly listingDomainService: ListingDomainService,
  ) {}

  async execute(dto: UpdateListingDto): Promise<Listing> {
    const listing = await this.listingRepository.findById(dto.id);
    if (!listing) {
      throw new Error('Листинг не найден');
    }

    const updatedListing = this.listingDomainService.updateListing(listing, {
      availabilityPeriod: dto.availabilityPeriod,
      isAvailable: dto.isAvailable,
    });

    return this.listingRepository.save(updatedListing);
  }
}
