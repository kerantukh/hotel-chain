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
    const listing = this.listingDomainService.createListing(
      dto.name,
      dto.description,
      dto.location,
      dto.costPerNight,
      dto.roomCount,
      dto.guestLimit,
      dto.features,
      dto.availabilityPeriod,
      user.sub,
    );

    // Сохраняем листинг через репозиторий
    return this.listingRepository.save(listing);
  }
}
