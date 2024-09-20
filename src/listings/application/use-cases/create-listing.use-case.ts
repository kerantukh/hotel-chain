import { Injectable } from '@nestjs/common';
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';
import { Listing } from 'src/listings/domain/entities/listing.entity';
import { ConcreteListingBuilder } from 'src/listings/domain/builders/listing.builder';
import { CreateListingDto } from 'src/listings/presentation/dto/create-listing.dto';

@Injectable()
export class CreateListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(dto: CreateListingDto): Promise<Listing> {
    const listing = new ConcreteListingBuilder()
      .withName(dto.name)
      .withDescription(dto.description)
      .withLocation(
        dto.location.street,
        dto.location.city,
        dto.location.state,
        dto.location.country,
        dto.location.zipCode,
      )
      .withCostPerNight(dto.costPerNight.amount, dto.costPerNight.currency)
      .withRoomCount(dto.roomCount)
      .withGuestLimit(dto.guestLimit)
      .withFeatures(dto.features)
      .withAvailabilityPeriod(
        dto.availabilityPeriod.startDate,
        dto.availabilityPeriod.endDate,
      )
      .build();

    return this.listingRepository.save(listing);
  }
}
