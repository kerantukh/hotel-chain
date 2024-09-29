/**
 * Класс для представления географических координат
 */
export class Coordinates {
  /**
   * Конструктор принимает широту и долготу
   * @param latitude - Широта
   * @param longitude - Долгота
   */
  constructor(
    private latitude: number,
    private longitude: number,
  ) {
    this.validateInvariants(); // Проверка инвариантов
  }

  /**
   * Метод для получения широты
   * @returns {number} Широта
   */
  getLatitude(): number {
    return this.latitude;
  }

  /**
   * Метод для получения долготы
   * @returns {number} Долгота
   */
  getLongitude(): number {
    return this.longitude;
  }

  /**
   * Метод для сравнения двух координат
   * @param other - Другие координаты
   * @returns {boolean} True, если координаты равны
   */
  equals(other: Coordinates): boolean {
    return (
      this.latitude === other.latitude && this.longitude === other.longitude
    );
  }

  /**
   * Статический метод для проверки валидности координат
   * @param latitude - Широта
   * @param longitude - Долгота
   * @returns {boolean} True, если координаты валидны
   */
  static isValid(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    );
  }

  /**
   * Метод для проверки инвариантов объекта Coordinates
   * @throws {Error} Если инварианты нарушены
   */
  private validateInvariants(): void {
    if (!Coordinates.isValid(this.latitude, this.longitude)) {
      throw new Error(
        'Некорректные координаты: широта должна быть в диапазоне от -90 до 90 градусов, долгота должна быть в диапазоне от -180 до 180 градусов.',
      );
    }
  }
}
