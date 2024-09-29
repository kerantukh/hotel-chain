import { Listing } from '../entities/listing.entity';
import { Score } from '../value-objects/score.vo';
import { DateRange } from '../value-objects/date-range.vo';
import { Money } from '../value-objects/money.vo';
import { Currency } from '../value-objects/currency.vo';
import { Coordinates } from '../value-objects/coordinates.vo';
import { Address } from '../value-objects/address.vo';

// Добавление нового класса ошибки
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Класс, представляющий агрегат объявления.
 */
export class ListingAggregate {
  /**
   * Создает экземпляр агрегата объявления.
   * @param listing - Объект объявления.
   * @throws {Error} Если объявление не определено.
   */
  constructor(private readonly listing: Listing) {
    this.ensureInvariants();
  }

  /**
   * Проверяет инварианты доменной модели.
   * @throws {Error} Если нарушены инварианты.
   */
  private ensureInvariants(): void {
    if (!this.listing) {
      throw new Error('Объявление должно быть определено.');
    }
    // Добавьте другие инварианты при необходимости
    this.validatePositiveNumber(
      this.listing.roomCount,
      'Количество комнат должно быть больше нуля.',
    );
    this.validatePositiveNumber(
      this.listing.guestLimit,
      'Лимит гостей должен быть больше нуля.',
    );
    this.validateCostPerNight(this.listing.costPerNight);
    this.validateName(this.listing.name);
    this.validateDescription(this.listing.description);
    this.validateCurrency(this.listing.currency);
    this.validateLocation(this.listing.location);
    this.validateCoordinates(this.listing.coordinates);
    this.validateAvailabilityPeriod(this.listing.availabilityPeriod);
    this.validateScore(this.listing.score);
  }

  /**
   * Возвращает текущее объявление.
   * @returns {Listing} Объект объявления.
   */
  getListing(): Listing {
    return this.listing;
  }

  /**
   * Обновляет описание объявления.
   * @param description - Новое описание.
   * @throws {Error} Если описание пустое или недопустимое.
   */
  updateDescription(description: string): void {
    this.validateInput(
      description,
      (val) => typeof val === 'string' && val.trim() !== '',
      'Описание не может быть пустым.',
    );
    this.listing.updateDescription(description);
    this.ensureInvariants();
  }

  /**
   * Добавляет новую функцию к объявлению.
   * @param feature - Функция для добавления.
   * @throws {Error} Если функция недопустима.
   */
  addFeature(feature: string): void {
    if (!feature) {
      throw new Error('Нечего добавлять.');
    }
    this.listing.addFeature(feature);
    this.ensureInvariants();
  }

  /**
   * Удаляет функцию из объявления.
   * @param feature - Функция для удаления.
   * @throws {Error} Если функция недопустима.
   */
  removeFeature(feature: string): void {
    if (!feature) {
      throw new Error('Нечего удалять.');
    }
    this.listing.removeFeature(feature);
    this.ensureInvariants();
  }

  /**
   * Обновляет количество комнат в объявлении.
   * @param newCount - Новое количество комнат.
   * @throws {Error} Если количество комнат меньше или равно нулю.
   */
  updateRoomCount(newCount: number): void {
    this.validatePositiveNumber(
      newCount,
      'Количество комнат должно быть больше нуля.',
    );
    this.listing.updateRoomCount(newCount);
    this.ensureInvariants();
  }

  /**
   * Обновляет лимит гостей в объявлении.
   * @param newLimit - Новый лимит гостей.
   * @throws {Error} Если лимит гостей меньше или равен нулю.
   */
  updateGuestLimit(newLimit: number): void {
    this.validatePositiveNumber(
      newLimit,
      'Лимит гостей должен быть больше нуля.',
    );
    this.listing.updateGuestLimit(newLimit);
    this.ensureInvariants();
  }

  /**
   * Обновляет стоимость за ночь.
   * @param newCost - Новая стоимость.
   * @throws {Error} Если стоимость меньше или равна нулю.
   */
  updateCostPerNight(newCost: Money): void {
    if (!newCost || newCost.getAmount() <= 0) {
      throw new Error('Стоимость за ночь должна быть больше нуля.');
    }
    this.listing.updateCostPerNight(newCost);
    this.ensureInvariants();
  }

  /**
   * Обновляет валюту объявления.
   * @param newCurrency - Новая валюта.
   * @throws {Error} Если валюта недопустима.
   */
  updateCurrency(newCurrency: Currency): void {
    if (!newCurrency) {
      throw new Error('Валюта должна быть определена.');
    }
    this.listing.updateCurrency(newCurrency);
    this.ensureInvariants();
  }

  /**
   * Обновляет доступность объявления.
   * @param isAvailable - Новое значение доступности.
   * @throws {Error} Если значение не булевое.
   */
  updateAvailability(isAvailable: boolean): void {
    if (typeof isAvailable !== 'boolean') {
      throw new Error('Значение доступности должно быть булевым.');
    }
    this.listing.updateAvailability(isAvailable);
    this.ensureInvariants();
  }

  /**
   * Обновляет оценку объявления.
   * @param newScore - Новая оценка.
   * @param ownerId - ID владельца, который ставит оценку.
   * @throws {Error} Если владелец пытается поставить себе оценку или оценка недопустима.
   */
  updateScore(newScore: Score, ownerId: number): void {
    if (this.listing.isOwner(ownerId)) {
      throw new Error('Владелец не может ставить себе оценку.');
    }
    this.validateScore(newScore);
    this.listing.updateScore(newScore);
    this.ensureInvariants();
  }

  /**
   * Рассчитывает среднюю оценку объявления.
   * @param newScore - Новая оценка для расчета.
   * @throws {Error} Если оценка недопустима.
   */
  calculateAverageScore(newScore: Score): void {
    this.validateScore(newScore);
    const average =
      (this.listing.getScore().getValue() + newScore.getValue()) / 2;
    this.listing.updateScore(new Score(average));
    this.ensureInvariants();
  }

  /**
   * Удаляет объявление.
   */
  removeListing(): void {
    this.listing.removeListing();
  }

  /**
   * Проверяет, активно ли объявление.
   * @returns {boolean} Статус активности.
   */
  isActive(): boolean {
    return this.listing.isActive();
  }

  /**
   * Проверяет, было ли обновление объявления недавно.
   * @param days - Количество дней для проверки.
   * @returns {boolean} Результат проверки.
   */
  wasUpdatedRecently(days: number): boolean {
    return this.listing.wasUpdatedRecently(days);
  }

  /**
   * Проверяет доступность объявления на определенную дату.
   * @param date - Дата для проверки.
   * @returns {boolean} Результат проверки.
   */
  isAvailableOnDate(date: Date): boolean {
    return this.listing.isAvailableOnDate(date);
  }

  /**
   * Проверяет доступность объявления на период.
   * @param startDate - Начальная дата.
   * @param endDate - Конечная дата.
   * @returns {boolean} Результат проверки.
   */
  isAvailableForPeriod(startDate: Date, endDate: Date): boolean {
    return this.listing.isAvailableForPeriod(startDate, endDate);
  }

  /**
   * Проверяет допустимость входного значения.
   * @param value - Проверяемое значение.
   * @param condition - Условие проверки.
   * @param errorMessage - Сообщение об ошибке.
   * @throws {Error} Если значение не соответствует условию.
   */
  private validateInput(
    value: any,
    condition: (val: any) => boolean,
    errorMessage: string,
  ): void {
    if (!condition(value)) {
      throw new Error(errorMessage);
    }
  }

  /**
   * Проверяет, является ли число положительным.
   * @param value - Число для проверки.
   * @param errorMessage - Сообщение об ошибке.
   * @throws {Error} Если число не положительное.
   */
  private validatePositiveNumber(value: number, errorMessage: string): void {
    if (value <= 0) {
      throw new Error(errorMessage);
    }
  }

  /**
   * Проверяет допустимость названия.
   * @param name - Название для проверки.
   * @throws {Error} Если название пустое.
   */
  private validateName(name: string): void {
    if (name.trim() === '') {
      throw new Error('Название не может быть пустым.');
    }
  }

  /**
   * Проверяет допустимость описания.
   * @param description - Описание для проверки.
   * @throws {Error} Если описание пустое.
   */
  private validateDescription(description: string): void {
    if (description.trim() === '') {
      throw new ValidationError('Описание не может быть пустым.');
    }
  }

  /**
   * Проверяет допустимость валюты.
   * @param currency - Валюта для проверки.
   * @throws {Error} Если валюта некорректна.
   */
  private validateCurrency(currency: Currency): void {
    if (!Currency.isValid(currency)) {
      throw new Error('Некорректная валюта.');
    }
  }

  /**
   * Проверяет допустимость адреса.
   * @param location - Адрес для проверки.
   * @throws {Error} Если адрес некорректен.
   */
  private validateLocation(location: Address): void {
    if (!location.isValid()) {
      throw new Error('Некорректный адрес.');
    }
  }

  /**
   * Проверяет допустимость координат.
   * @param coordinates - Координаты для проверки.
   * @throws {Error} Если координаты некорректны.
   */
  private validateCoordinates(coordinates: Coordinates): void {
    if (
      !Coordinates.isValid(
        coordinates.getLatitude(),
        coordinates.getLongitude(),
      )
    ) {
      throw new Error('Некорректные координаты.');
    }
  }

  /**
   * Проверяет допустимость периода доступности.
   * @param availabilityPeriod - Период для проверки.
   * @throws {Error} Если период некорректен.
   */
  private validateAvailabilityPeriod(availabilityPeriod: DateRange): void {
    if (
      !DateRange.isValid(
        availabilityPeriod.getStartDate(),
        availabilityPeriod.getEndDate(),
      )
    ) {
      throw new Error('Некорректный период доступности.');
    }
  }

  /**
   * Проверяет допустимость оценки.
   * @param score - Оценка для проверки.
   * @throws {Error} Если оценка не в диапазоне от 0 до 10.
   */
  private validateScore(score: Score): void {
    if (score.getValue() < 0 || score.getValue() > 10) {
      throw new Error('Оценка должна быть в диапазоне от 0 до 10.');
    }
  }

  /**
   * Проверяет допустимость стоимости за ночь.
   * @param newCost - Стоимость для проверки.
   * @throws {Error} Если стоимость меньше или равна нулю.
   */
  private validateCostPerNight(newCost: Money): void {
    if (!newCost || newCost.getAmount() <= 0) {
      throw new Error('Стоимость за ночь должна быть больше нуля.');
    }
  }
}
