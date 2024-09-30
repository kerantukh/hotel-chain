import { Listing } from '../entities/listing.entity';

/**
 * Служба домена для управления листингами.
 */
export class ListingDomainService {
  constructor() {}

  /**
   * Создает новый листинг.
   * @param props Свойства для создания листинга.
   * @returns Созданный листинг.
   */
  createListing(props: Partial<Listing>): Listing {
    this.validateRequiredFields(props);
    return Listing.create(props);
  }

  /**
   * Удаляет листинг.
   * @param listing Листинг для удаления.
   */
  deleteListing(listing: Listing): void {
    listing.delete();
  }

  /**
   * Обновляет листинг.
   * @param listing Листинг для обновления.
   * @param props Свойства для обновления листинга.
   * @returns Обновленный листинг.
   */
  updateListing(listing: Listing, props: Partial<Listing>): Listing {
    this.validateRequiredFields(props);
    listing.update(props);
    return listing;
  }

  /**
   * Валидирует листинг.
   * @param listing Листинг для валидации.
   * @returns Результат валидации.
   */
  validateListing(listing: Listing): boolean {
    return this.isValidListing(listing);
  }

  /**
   * Проверяет, является ли листинг валидным.
   * @param listing Листинг для проверки.
   * @returns true, если листинг валиден, иначе false.
   */
  private isValidListing(listing: Listing): boolean {
    return listing.costPerNight.getAmount() > 0 && listing.guestLimit > 0;
  }

  /**
   * Проверяет наличие обязательных полей.
   * @param props Свойства листинга.
   * @throws Ошибка, если обязательные поля отсутствуют.
   */
  private validateRequiredFields(props: Partial<Listing>): void {
    if (!props.name || !props.location || !props.costPerNight) {
      throw new Error('Обязательные поля отсутствуют');
    }
  }
}
