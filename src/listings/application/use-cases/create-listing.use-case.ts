import { Injectable } from '@nestjs/common';
import { ListingDomainService } from '../../domain/services/listing.domain.service';
import { CreateListingDto } from '../dto/create-listing.dto';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Listing } from '../../domain/entities/listing.entity';
import { ListingRepository } from '../../domain/repositories/listing.repository';

@Injectable()
export class CreateListingUseCase {
  constructor(
    private readonly listingDomainService: ListingDomainService,
    private readonly listingRepository: ListingRepository,
  ) {}

  async execute(dto: CreateListingDto, user: ActiveUserData): Promise<Listing> {
    // Создаем листинг через доменный сервис
    const listing = this.listingDomainService.createListing({
      name: dto.name,
      description: dto.description,
      location: dto.location,
      costPerNight: dto.costPerNight,
      roomCount: dto.roomCount,
      guestLimit: dto.guestLimit,
      features: dto.features,
      availabilityPeriod: dto.availabilityPeriod,
      ownerId: user.sub,
    });

    // Сохраняем листинг через репозиторий
    return this.listingRepository.save(listing);
  }
}
