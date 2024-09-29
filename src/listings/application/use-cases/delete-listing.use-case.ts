import { Injectable } from '@nestjs/common';
import { ListingDomainService } from 'src/listings/domain/services/listing.domain.service';
import { Listing } from 'src/listings/domain/models/listing.model';
// Добавьте импорт репозитория
import { ListingRepository } from 'src/listings/domain/repositories/listing.repository';

@Injectable()
export class DeleteListingUseCase {
  // Добавьте репозиторий в конструктор
  constructor(
    private readonly listingDomainService: ListingDomainService,
    private readonly listingRepository: ListingRepository, // новый параметр
  ) {}

  async execute(listing: Listing): Promise<void> {
    // Используйте репозиторий для удаления объявления
    await this.listingRepository.delete(listing.id); // обновленный код
  }
}
