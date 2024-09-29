/**
 * Класс для представления фотографии
 */
export class Photo {
  /**
   * Конструктор для инициализации объекта Photo
   * @param url - URL фотографии
   * @param description - Описание фотографии
   */
  constructor(
    private url: string,
    private description: string,
  ) {
    this.validateInvariants(); // Вызов метода для проверки инвариантов
  }

  /**
   * Метод для проверки инвариантов объекта Photo
   * @throws {Error} Если инварианты нарушены
   */
  private validateInvariants(): void {
    if (!Photo.isValid(this.url, this.description)) {
      throw new Error('Некорректные данные для фотографии.');
    }
  }

  /**
   * Метод для получения URL фотографии
   * @returns {string} URL фотографии
   */
  getUrl(): string {
    return this.url;
  }

  /**
   * Метод для получения описания фотографии
   * @returns {string} Описание фотографии
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Метод для проверки валидности данных фотографии
   * @returns {boolean} True, если данные валидны
   */
  static isValid(url: string, description: string): boolean {
    return url.trim() !== '' && description.trim() !== '';
  }
}
