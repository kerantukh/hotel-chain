import { Money } from '../value-objects/money.vo';
import { Address } from '../value-objects/address.vo';
import { DateRange } from '../value-objects/date-range.vo';
import { Score } from '../value-objects/score.vo';
import { Currency } from '../value-objects/currency.vo';
import { Coordinates } from '../value-objects/coordinates.vo';
import { Photo } from '../value-objects/photo.vo';
import { ListingCreatedEvent } from '../events/listing-created.event';
import { ListingUpdatedEvent } from '../events/listing-updated.event';
import { ListingDeletedEvent } from '../events/listing-deleted.event';
import { ListingValidator } from '../validators/listing.validator';

/**
 * Класс для представления объявления
 */
export class Listing {
  id: number;
  name: string;
  description: string;
  location: Address;
  costPerNight: Money;
  roomCount: number;
  guestLimit: number;
  score: Score;
  isAvailable: boolean;
  features: string[];
  availabilityPeriod: DateRange;
  createdDate: Date;
  modifiedDate: Date;
  ownerId: number;
  isDeleted: boolean;
  currency: Currency;
  coordinates: Coordinates;
  images: Photo[];
  bookings: number[];
  private _events: any[] = [];

  /**
   * Конструктор класса Listing
   * @param props - Данные для инициализации объявления
   */
  constructor(props: Partial<Listing>) {
    Object.assign(this, props);
    ListingValidator.validateInvariants(this);
  }

  /**
   * Создает новое объявление
   * @param props - Данные для создания объявления
   * @returns {Listing} Новое объявление
   */
  static create(props: Partial<Listing>): Listing {
    const listing = new Listing(props);
    listing.addEvent(new ListingCreatedEvent(listing));
    ListingValidator.validateInvariants(listing);
    return listing;
  }

  /**
   * Обновляет объявление
   * @param props - Данные для обновления объявления
   */
  update(props: Partial<Listing>): void {
    const oldProps = { ...this };
    this.updateProperties(props);
    ListingValidator.validateUpdatedProperties(oldProps, props);
    this.updateModifiedDate();
    this.addEvent(new ListingUpdatedEvent(this));
    ListingValidator.validateInvariants(this);
  }

  /**
   * Явное обновление свойств объявления
   * @param props - Данные для обновления объявления
   */
  private updateProperties(props: Partial<Listing>): void {
    Object.keys(props).forEach((key) => {
      if (props[key] !== undefined) {
        this[key] = props[key];
      }
    });
  }

  /**
   * Удаляет объявление
   */
  delete(): void {
    if (!this.isDeleted) {
      this.isDeleted = true;
      this.updateModifiedDate();
      this.addEvent(new ListingDeletedEvent(this));
      ListingValidator.validateInvariants(this);
    }
  }

  /**
   * Добавляет событие
   * @param event - Событие
   */
  private addEvent(event: any): void {
    this._events.push(event);
  }

  /**
   * Возвращает события
   * @returns {any[]} События
   */
  getEvents(): any[] {
    return this._events;
  }

  /**
   * Очищает события
   */
  clearEvents(): void {
    this._events = [];
  }

  /**
   * Проверяет, активно ли объявление
   * @returns {boolean} True, если объявление активно
   */
  isActive(): boolean {
    return this.isAvailable;
  }

  /**
   * Возвращает координаты объявления
   * @returns {Coordinates} Координаты
   */
  getCoordinates(): Coordinates {
    return this.coordinates;
  }

  /**
   * Возвращает адрес объявления
   * @returns {Address} Адрес
   */
  getLocation(): Address {
    return this.location;
  }

  /**
   * Возвращает количество комнат
   * @returns {number} Количество комнат
   */
  getRoomCount(): number {
    return this.roomCount;
  }

  /**
   * Возвращает лимит гостей
   * @returns {number} Лимит гостей
   */
  getGuestLimit(): number {
    return this.guestLimit;
  }

  /**
   * Добавляет особенность к объявлению
   * @param feature - Особенность
   */
  addFeature(feature: string): void {
    this.features.push(feature);
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Добавляет изображение к объявлению
   * @param image - Изображение
   */
  addImage(image: Photo): void {
    this.images.push(image);
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет название объявления
   * @param name - Новое название
   */
  updateName(name: string): void {
    this.name = name;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет доступность объявления
   * @param isAvailable - Новая доступность
   */
  updateAvailability(isAvailable: boolean): void {
    this.isAvailable = isAvailable;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет описание объявления
   * @param description - Новое описание
   */
  updateDescription(description: string): void {
    this.description = description;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет стоимость за ночь
   * @param newCost - Новая стоимость
   */
  updateCostPerNight(newCost: Money): void {
    this.costPerNight = newCost;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет адрес объявления
   * @param newLocation - Новый адрес
   */
  updateLocation(newLocation: Address): void {
    this.location = newLocation;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет количество комнат
   * @param newCount - Новое количество комнат
   */
  updateRoomCount(newCount: number): void {
    this.roomCount = newCount;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет лимит гостей
   * @param newLimit - Новый лимит гостей
   */
  updateGuestLimit(newLimit: number): void {
    this.guestLimit = newLimit;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет рейтинг объявления
   * @param newScore - Новый рейтинг
   */
  updateScore(newScore: Score): void {
    this.score = newScore;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет координаты объявления
   * @param newCoordinates - Новые координаты
   */
  updateCoordinates(newCoordinates: Coordinates): void {
    this.coordinates = newCoordinates;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет период доступности
   * @param newPeriod - Новый период доступности
   */
  updateAvailabilityPeriod(newPeriod: DateRange): void {
    this.availabilityPeriod = newPeriod;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет валюту стоимости за ночь
   * @param newCurrency - Новая валюта
   */
  updateCurrency(newCurrency: Currency): void {
    this.currency = newCurrency;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Удаляет особенность из объявления
   * @param feature - Особенность
   */
  removeFeature(feature: string): void {
    const index = this.features.indexOf(feature);
    if (index > -1) {
      this.features.splice(index, 1);
      this.updateModifiedDate();
      ListingValidator.validateInvariants(this);
    }
  }

  /**
   * Удаляет изображение из объявления
   * @param image - Изображение
   */
  removeImage(image: Photo): void {
    const index = this.images.indexOf(image);
    if (index > -1) {
      this.images.splice(index, 1);
      this.updateModifiedDate();
      ListingValidator.validateInvariants(this);
    }
  }

  /**
   * Деактивирует объявление
   */
  deactivateListing(): void {
    this.isAvailable = false;
    this.updateModifiedDate();
    ListingValidator.validateInvariants(this);
  }

  /**
   * Обновляет дату последнего изменения
   */
  private updateModifiedDate(): void {
    this.modifiedDate = new Date();
    ListingValidator.validateInvariants(this);
  }
}
