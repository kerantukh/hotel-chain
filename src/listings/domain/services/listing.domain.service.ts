import { Injectable, Logger } from '@nestjs/common';
import { Listing } from '../entities/listing.entity';
import { Address } from '../value-objects/address.vo';
import { DateRange } from '../value-objects/date-range.vo';
import { Money } from '../value-objects/money.vo';
import { Score } from '../value-objects/score.vo';
import { Photo } from '../value-objects/photo.vo';
import { ListingAggregate } from '../aggregates/listing.aggregate';
import { ListingDetailsAggregate } from '../aggregates/listing-details.aggregate';
import { ListingPricingAggregate } from '../aggregates/listing-pricing.aggregate';
import { ListingAvailabilityAggregate } from '../aggregates/listing-availability.aggregate';
import { ListingMediaAggregate } from '../aggregates/listing-media.aggregate';
import { ListingFeaturesAggregate } from '../aggregates/listing-features.aggregate';
import { InvalidListingDataException } from '../exceptions/invalid-listing-data.exception';
import { ListingValidator } from '../validators/listing.validator';
import { ListingBusinessRules } from '../business-rules/listing.business-rules';

@Injectable()
export class ListingDomainService {
  private readonly logger = new Logger(ListingDomainService.name);
  private readonly validator = new ListingValidator();
  private readonly businessRules = new ListingBusinessRules();

  // Метод для создания нового листинга
  createListing(
    name: string,
    description: string,
    location: Address,
    costPerNight: Money,
    roomCount: number,
    guestLimit: number,
    features: string[],
    availabilityPeriod: DateRange,
    ownerId: number,
  ): Listing {
    this.logger.log(`Создание нового листинга для владельца ${ownerId}`);

    // Валидация данных листинга
    this.validator.validateListingData(
      name,
      description,
      location,
      costPerNight,
      roomCount,
      guestLimit,
    );

    // Проверка бизнес-логики
    this.businessRules.checkBusinessLogic(
      name,
      costPerNight,
      roomCount,
      guestLimit,
    );

    // Инициализация нового листинга
    const listing = this.initializeListing(
      name,
      description,
      location,
      costPerNight,
      roomCount,
      guestLimit,
      features,
      availabilityPeriod,
      ownerId,
    );

    // Проверка инвариантов
    this.checkInvariants(new ListingAggregate(listing));

    // Сохранение листинга
    return listing;
  }

  // Метод для обновления существующего листинга
  updateListing(
    listing: Listing,
    name?: string,
    description?: string,
    location?: Address,
    costPerNight?: Money,
    roomCount?: number,
    guestLimit?: number,
    features?: string[],
    availabilityPeriod?: DateRange,
    isAvailable?: boolean,
  ): Listing {
    this.logger.log(`Обновление листинга с ID ${listing.id}`);

    // Создание агрегатов для обновления данных листинга
    const listingAggregate = new ListingAggregate(listing);
    const detailsAggregate = new ListingDetailsAggregate(listing);
    const pricingAggregate = new ListingPricingAggregate(listing);
    const availabilityAggregate = new ListingAvailabilityAggregate(listing);
    const featuresAggregate = new ListingFeaturesAggregate(listing);

    // Обновление данных листинга
    this.updateListingDetails(
      detailsAggregate,
      pricingAggregate,
      availabilityAggregate,
      featuresAggregate,
      name,
      description,
      location,
      costPerNight,
      roomCount,
      guestLimit,
      features,
      availabilityPeriod,
      isAvailable,
    );

    // Проверка бизнес-логики
    this.businessRules.checkBusinessLogic(
      name,
      costPerNight,
      roomCount,
      guestLimit,
    );

    // Проверка инвариантов
    this.checkInvariants(listingAggregate);

    // Сохранение обновленного листинга
    return listing;
  }

  // Метод для удаления листинга
  deleteListing(listing: Listing): void {
    this.logger.log(`Удаление листинга с ID ${listing.id}`);

    const listingAggregate = new ListingAggregate(listing);
    listingAggregate.removeListing();
  }

  // Метод для добавления изображения к листингу
  addImageToListing(listing: Listing, image: Photo): Listing {
    this.logger.log(`Добавление изображения к листингу с ID ${listing.id}`);

    const mediaAggregate = new ListingMediaAggregate(listing);
    mediaAggregate.addImage(image);

    // Проверка инвариантов
    this.checkInvariants(new ListingAggregate(listing));

    return listing;
  }

  // Метод для удаления изображения из листинга
  removeImageFromListing(listing: Listing, image: Photo): Listing {
    this.logger.log(`Удаление изображения из листинга с ID ${listing.id}`);

    const mediaAggregate = new ListingMediaAggregate(listing);
    mediaAggregate.removeImage(image);

    // Проверка инвариантов
    this.checkInvariants(new ListingAggregate(listing));

    return listing;
  }

  // Метод для проверки инвариантов листинга
  private checkInvariants(listingAggregate: ListingAggregate): void {
    // Проверка инвариантов для листинга
    if (listingAggregate.getListing().roomCount <= 0) {
      throw new InvalidListingDataException(
        'Количество комнат должно быть положительным числом',
      );
    }
    if (listingAggregate.getListing().guestLimit <= 0) {
      throw new InvalidListingDataException(
        'Лимит гостей должен быть положительным числом',
      );
    }
    // Добавьте другие проверки инвариантов по мере необходимости
  }

  // Метод для инициализации нового листинга
  private initializeListing(
    name: string,
    description: string,
    location: Address,
    costPerNight: Money,
    roomCount: number,
    guestLimit: number,
    features: string[],
    availabilityPeriod: DateRange,
    ownerId: number,
  ): Listing {
    const listing = new Listing();
    listing.name = name;
    listing.description = description;
    listing.location = location;
    listing.costPerNight = costPerNight;
    listing.roomCount = roomCount;
    listing.guestLimit = guestLimit;
    listing.features = features;
    listing.availabilityPeriod = availabilityPeriod;
    listing.createdDate = new Date();
    listing.modifiedDate = new Date();
    listing.isAvailable = true;
    listing.score = new Score(0);
    listing.ownerId = ownerId;
    return listing;
  }

  // Метод для обновления данных листинга
  private updateListingDetails(
    detailsAggregate: ListingDetailsAggregate,
    pricingAggregate: ListingPricingAggregate,
    availabilityAggregate: ListingAvailabilityAggregate,
    featuresAggregate: ListingFeaturesAggregate,
    name?: string,
    description?: string,
    location?: Address,
    costPerNight?: Money,
    roomCount?: number,
    guestLimit?: number,
    features?: string[],
    availabilityPeriod?: DateRange,
    isAvailable?: boolean,
  ): void {
    if (name !== undefined) detailsAggregate.updateDescription(name);
    if (description !== undefined)
      detailsAggregate.updateDescription(description);
    if (location) detailsAggregate.updateLocation(location);
    if (costPerNight) pricingAggregate.updateCostPerNight(costPerNight);
    if (roomCount !== undefined) detailsAggregate.updateRoomCount(roomCount);
    if (guestLimit !== undefined) detailsAggregate.updateGuestLimit(guestLimit);
    if (features)
      features.forEach((feature) => featuresAggregate.addFeature(feature));
    if (availabilityPeriod)
      availabilityAggregate.updateAvailabilityPeriod(availabilityPeriod);
    if (isAvailable !== undefined)
      availabilityAggregate.updateAvailability(isAvailable);
  }
}
