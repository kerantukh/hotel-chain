import { Listing } from '../entities/listing.entity';
import { Currency } from '../value-objects/currency.vo';
import { Coordinates } from '../value-objects/coordinates.vo';
import { DateRange } from '../value-objects/date-range.vo';
import { Score } from '../value-objects/score.vo';

export class ListingValidator {
  static validateInvariants(listing: Listing): void {
    this.validateRoomCount(listing);
    this.validateGuestLimit(listing);
    this.validateCostPerNight(listing);
    this.validateName(listing);
    this.validateDescription(listing);
    this.validateCurrency(listing);
    this.validateLocation(listing);
    this.validateCoordinates(listing);
    this.validateAvailabilityPeriod(listing);
    this.validateScore(listing);
  }

  static validateUpdatedProperties(
    oldProps: Partial<Listing>,
    newProps: Partial<Listing>,
  ): void {
    if (
      newProps.roomCount !== undefined &&
      newProps.roomCount !== oldProps.roomCount
    ) {
      this.validateRoomCount(newProps as Listing);
    }
    if (
      newProps.guestLimit !== undefined &&
      newProps.guestLimit !== oldProps.guestLimit
    ) {
      this.validateGuestLimit(newProps as Listing);
    }
    if (
      newProps.costPerNight !== undefined &&
      newProps.costPerNight !== oldProps.costPerNight
    ) {
      this.validateCostPerNight(newProps as Listing);
    }
    if (newProps.name !== undefined && newProps.name !== oldProps.name) {
      this.validateName(newProps as Listing);
    }
    if (
      newProps.description !== undefined &&
      newProps.description !== oldProps.description
    ) {
      this.validateDescription(newProps as Listing);
    }
    if (
      newProps.currency !== undefined &&
      newProps.currency !== oldProps.currency
    ) {
      this.validateCurrency(newProps as Listing);
    }
    if (
      newProps.location !== undefined &&
      newProps.location !== oldProps.location
    ) {
      this.validateLocation(newProps as Listing);
    }
    if (
      newProps.coordinates !== undefined &&
      newProps.coordinates !== oldProps.coordinates
    ) {
      this.validateCoordinates(newProps as Listing);
    }
    if (
      newProps.availabilityPeriod !== undefined &&
      newProps.availabilityPeriod !== oldProps.availabilityPeriod
    ) {
      this.validateAvailabilityPeriod(newProps as Listing);
    }
    if (newProps.score !== undefined && newProps.score !== oldProps.score) {
      this.validateScore(newProps as Listing);
    }
  }

  private static validateRoomCount(listing: Listing): void {
    if (listing.roomCount <= 0) {
      throw new Error(
        'Количество комнат не может быть отрицательным или равным нулю.',
      );
    }
  }

  private static validateGuestLimit(listing: Listing): void {
    if (listing.guestLimit <= 0) {
      throw new Error(
        'Лимит гостей не может быть отрицательным или равным нулю.',
      );
    }
  }

  private static validateCostPerNight(listing: Listing): void {
    if (!listing.costPerNight.isValid()) {
      throw new Error('Некорректная стоимость за ночь.');
    }
  }

  private static validateName(listing: Listing): void {
    if (listing.name.trim() === '') {
      throw new Error('Название не может быть пустым.');
    }
  }

  private static validateDescription(listing: Listing): void {
    if (listing.description.trim() === '') {
      throw new Error('Описание не может быть пустым.');
    }
  }

  private static validateCurrency(listing: Listing): void {
    if (!Currency.isValid(listing.currency)) {
      throw new Error('Некорректная валюта.');
    }
  }

  private static validateLocation(listing: Listing): void {
    if (!listing.location.isValid()) {
      throw new Error('Некорректный адрес.');
    }
  }

  private static validateCoordinates(listing: Listing): void {
    if (
      !Coordinates.isValid(
        listing.coordinates.getLatitude(),
        listing.coordinates.getLongitude(),
      )
    ) {
      throw new Error('Некорректные координаты.');
    }
  }

  private static validateAvailabilityPeriod(listing: Listing): void {
    if (
      !DateRange.isValid(
        listing.availabilityPeriod.getStartDate(),
        listing.availabilityPeriod.getEndDate(),
      )
    ) {
      throw new Error('Некорректный период доступности.');
    }
  }

  private static validateScore(listing: Listing): void {
    if (!Score.isValid(listing.score.getValue())) {
      throw new Error('Некорректный рейтинг.');
    }
  }
}
