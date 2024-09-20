import { Module } from '@nestjs/common';
import { ListingsController } from './presentation/listings.controller';
import { CreateListingUseCase } from './application/use-cases/create-listing.use-case';
import { UpdateListingUseCase } from './application/use-cases/update-listing.use-case';
import { DeleteListingUseCase } from './application/use-cases/delete-listing.use-case';
import { FindListingUseCase } from './application/use-cases/find-listing.use-case';
import { FindAllListingsUseCase } from './application/use-cases/find-all-listings.use-case';
import { ListingRepositoryImpl } from './infrastructure/repositories/listing.repository.impl';
import { ListingRepository } from './domain/repositories/listing.repository';

@Module({
  controllers: [ListingsController],
  providers: [
    CreateListingUseCase,
    UpdateListingUseCase,
    DeleteListingUseCase,
    FindListingUseCase,
    FindAllListingsUseCase,
    {
      provide: ListingRepository,
      useClass: ListingRepositoryImpl,
    },
  ],
})
export class ListingsModule {}
