import { Injectable } from '@nestjs/common';
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';
import { Listing } from '../../domain/entities/listing.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { Address } from '../../domain/value-objects/address.vo';
import { DateRange } from '../../domain/value-objects/date-range.vo';
import { UpdateListingDto } from 'src/listings/presentation/dto/update-listing.dto';

@Injectable()
export class UpdateListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(dto: UpdateListingDto): Promise<Listing> {
    const listing = await this.listingRepository.findById(dto.id);
    if (!listing) {
      throw new Error('Листинг не найден');
    }

    if (dto.name) listing.name = dto.name;
    if (dto.description) listing.description = dto.description;
    if (dto.location) {
      listing.updateLocation(
        new Address(
          dto.location.street,
          dto.location.city,
          dto.location.state,
          dto.location.country,
          dto.location.zipCode,
        ),
      );
    }
    if (dto.costPerNight) {
      listing.updatePrice(
        new Money(dto.costPerNight.amount, dto.costPerNight.currency),
      );
    }
    if (dto.roomCount) listing.roomCount = dto.roomCount;
    if (dto.guestLimit) listing.guestLimit = dto.guestLimit;
    if (dto.features) listing.updateFeatures(dto.features);
    if (dto.availabilityPeriod) {
      listing.updateAvailability(
        new DateRange(
          dto.availabilityPeriod.startDate,
          dto.availabilityPeriod.endDate,
        ),
      );
    }
    if (dto.isAvailable !== undefined) listing.setAvailability(dto.isAvailable);

    listing.modifiedDate = new Date();

    return this.listingRepository.save(listing);
  }
}
