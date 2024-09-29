import { Money } from '../value-objects/money.vo';
import { Address } from '../value-objects/address.vo';
import { DateRange } from '../value-objects/date-range.vo';
import { Score } from '../value-objects/score.vo';
import { Currency } from '../value-objects/currency.vo';
import { Coordinates } from '../value-objects/coordinates.vo';
import { Photo } from '../value-objects/photo.vo';

/**
 * Интерфейс для объявления
 */
interface IListing {
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
}

/**
 * Класс для представления объявления
 */
export class Listing implements IListing {
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

  /**
   * Конструктор класса Listing
   * @param data - Данные для инициализации объявления
   */
  constructor(data: IListing) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.location = data.location;
    this.costPerNight = data.costPerNight;
    this.roomCount = data.roomCount;
    this.guestLimit = data.guestLimit;
    this.score = data.score;
    this.isAvailable = data.isAvailable;
    this.features = data.features;
    this.availabilityPeriod = data.availabilityPeriod;
    this.createdDate = data.createdDate;
    this.modifiedDate = data.modifiedDate;
    this.ownerId = data.ownerId;
    this.isDeleted = data.isDeleted;
    this.currency = data.currency;
    this.coordinates = data.coordinates;
    this.images = data.images;
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
   * Возвращает рейтинг объявления
   * @returns {Score} Рейтинг
   */
  getScore(): Score {
    return this.score;
  }

  /**
   * Проверяет, было ли объявление обновлено недавно
   * @param days - Количество дней для проверки
   * @returns {boolean} True, если объявление было обновлено недавно
   */
  wasUpdatedRecently(days: number): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.modifiedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }

  /**
   * Проверяет, доступно ли объявление на указанную дату
   * @param date - Дата для проверки
   * @returns {boolean} True, если объявление доступно
   */
  isAvailableOnDate(date: Date): boolean {
    return this.isAvailable && this.availabilityPeriod.contains(date);
  }

  /**
   * Проверяет, доступно ли объявление на указанный период
   * @param startDate - Начальная дата периода
   * @param endDate - Конечная дата периода
   * @returns {boolean} True, если объявление доступно
   */
  isAvailableForPeriod(startDate: Date, endDate: Date): boolean {
    return (
      this.isAvailable &&
      this.availabilityPeriod.overlaps(new DateRange(startDate, endDate))
    );
  }

  /**
   * Проверяет, является ли объявление популярным
   * @returns {boolean} True, если объявление популярно
   */
  isPopular(): boolean {
    return this.score.getValue() >= 4.5;
  }

  /**
   * Возвращает стоимость за ночь
   * @returns {Money} Стоимость за ночь
   */
  getCostPerNight(): Money {
    return this.costPerNight;
  }

  calculateTotalCost(startDate: Date, endDate: Date): Money {
    const totalCost =
      (this.costPerNight.getAmount() *
        (endDate.getTime() - startDate.getTime())) /
      (1000 * 60 * 60 * 24);
    return new Money(totalCost, this.costPerNight.getCurrency());
  }

  /**
   * Возвращает период доступности
   * @returns {DateRange} Период доступности
   */
  getAvailabilityPeriod(): DateRange {
    return this.availabilityPeriod;
  }

  /**
   * Проверяет, является ли указанный пользователь владельцем объявления
   * @param ownerId - Идентификатор пользователя
   * @returns {boolean} True, если пользователь является владельцем
   */
  isOwner(ownerId: number): boolean {
    return this.ownerId === ownerId;
  }

  /**
   * Добавляет особенность к объявлению
   * @param feature - Особенность
   */
  addFeature(feature: string): void {
    this.features.push(feature);
    this.updateModifiedDate();
  }

  /**
   * Добавляет изображение к объявлению
   * @param image - Изображение
   */
  addImage(image: Photo): void {
    this.images.push(image);
    this.updateModifiedDate();
  }

  /**
   * Обновляет название объявления
   * @param name - Новое название
   */
  updateName(name: string): void {
    this.name = name;
    this.updateModifiedDate();
  }

  /**
   * Обновляет доступность объявления
   * @param isAvailable - Новая доступность
   */
  updateAvailability(isAvailable: boolean): void {
    this.isAvailable = isAvailable;
    this.updateModifiedDate();
  }

  /**
   * Обновляет описание объявления
   * @param description - Новое описание
   */
  updateDescription(description: string): void {
    this.description = description;
    this.updateModifiedDate();
  }

  /**
   * Обновляет стоимость за ночь
   * @param newCost - Новая стоимость
   */
  updateCostPerNight(newCost: Money): void {
    this.costPerNight = newCost;
    this.updateModifiedDate();
  }

  /**
   * Обновляет адрес объявления
   * @param newLocation - Новый адрес
   */
  updateLocation(newLocation: Address): void {
    this.location = newLocation;
    this.updateModifiedDate();
  }

  /**
   * Обновляет количество комнат
   * @param newCount - Новое количество комнат
   */
  updateRoomCount(newCount: number): void {
    this.roomCount = newCount;
    this.updateModifiedDate();
  }

  /**
   * Обновляет лимит гостей
   * @param newLimit - Новый лимит гостей
   */
  updateGuestLimit(newLimit: number): void {
    this.guestLimit = newLimit;
    this.updateModifiedDate();
  }

  /**
   * Обновляет рейтинг объявления
   * @param newScore - Новый рейтинг
   */
  updateScore(newScore: Score): void {
    this.score = newScore;
    this.updateModifiedDate();
  }

  /**
   * Обновляет координаты объявления
   * @param newCoordinates - Новые координаты
   */
  updateCoordinates(newCoordinates: Coordinates): void {
    this.coordinates = newCoordinates;
    this.updateModifiedDate();
  }

  /**
   * Обновляет период доступности
   * @param newPeriod - Новый период доступности
   */
  updateAvailabilityPeriod(newPeriod: DateRange): void {
    this.availabilityPeriod = newPeriod;
    this.updateModifiedDate();
  }

  /**
   * Обновляет валюту стоимости за ночь
   * @param newCurrency - Новая валюта
   */
  updateCurrency(newCurrency: Currency): void {
    this.currency = newCurrency;
    this.updateModifiedDate();
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
    }
  }

  /**
   * Деактивирует объявление
   */
  deactivateListing(): void {
    this.isAvailable = false;
    this.updateModifiedDate();
  }

  /**
   * Удаляет объявление
   */
  removeListing(): void {
    this.isDeleted = true;
    this.updateModifiedDate();
  }

  /**
   * Обновляет дату последнего изменения
   */
  private updateModifiedDate(): void {
    this.modifiedDate = new Date();
    this.validateInvariants();
  }

  /**
   * Валидация инвариантов
   * @throws {Error} Если инварианты нарушены
   */
  private validateInvariants(): void {
    this.validateRoomCount();
    this.validateGuestLimit();
    this.validateCostPerNight();
    this.validateName();
    this.validateDescription();
    this.validateCurrency();
    this.validateLocation();
    this.validateCoordinates();
    this.validateAvailabilityPeriod();
    this.validateScore();
  }

  private validateRoomCount(): void {
    if (this.roomCount <= 0) {
      throw new Error(
        'Количество комнат не может быть отрицательным или равным нулю.',
      );
    }
  }

  private validateGuestLimit(): void {
    if (this.guestLimit <= 0) {
      throw new Error(
        'Лимит гостей не может быть отрицательным или равным нулю.',
      );
    }
  }

  private validateCostPerNight(): void {
    if (!this.costPerNight.isValid()) {
      throw new Error('Некорректная стоимость за ночь.');
    }
  }

  private validateName(): void {
    if (this.name.trim() === '') {
      throw new Error('Название не может быть пустым.');
    }
  }

  private validateDescription(): void {
    if (this.description.trim() === '') {
      throw new Error('Описание не может быть пустым.');
    }
  }

  private validateCurrency(): void {
    if (!Currency.isValid(this.currency)) {
      throw new Error('Некорректная валюта.');
    }
  }

  private validateLocation(): void {
    if (!this.location.isValid()) {
      throw new Error('Некорректный адрес.');
    }
  }

  private validateCoordinates(): void {
    if (
      !Coordinates.isValid(
        this.coordinates.getLatitude(),
        this.coordinates.getLongitude(),
      )
    ) {
      throw new Error('Некорректные координаты.');
    }
  }

  private validateAvailabilityPeriod(): void {
    if (
      !DateRange.isValid(
        this.availabilityPeriod.getStartDate(),
        this.availabilityPeriod.getEndDate(),
      )
    ) {
      throw new Error('Некорректный период доступности.');
    }
  }

  private validateScore(): void {
    if (!Score.isValid(this.score.getValue())) {
      throw new Error('Некорректный рейтинг.');
    }
  }
}
