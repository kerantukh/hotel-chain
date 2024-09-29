/**
 * Класс для представления диапазона дат
 */
export class DateRange {
  /**
   * Конструктор принимает начальную и конечную даты
   * @param startDate - Начальная дата диапазона
   * @param endDate - Конечная дата диапазона
   */
  constructor(
    private readonly startDate: Date, // Начальная дата диапазона
    private readonly endDate: Date, // Конечная дата диапазона
  ) {
    this.validateDates(); // Валидация дат при создании объекта
  }

  /**
   * Метод для проверки, что начальная дата не позже конечной
   * @throws {Error} Если начальная дата позже конечной
   */
  private validateDates(): void {
    if (!DateRange.isValid(this.startDate, this.endDate)) {
      throw new Error('Дата начала не может быть позже даты окончания');
    }
  }

  /**
   * Метод для получения начальной даты
   * @returns {Date} Начальная дата
   */
  getStartDate(): Date {
    return this.startDate;
  }

  /**
   * Метод для получения конечной даты
   * @returns {Date} Конечная дата
   */
  getEndDate(): Date {
    return this.endDate;
  }

  /**
   * Метод для получения продолжительности в днях
   * @returns {number} Продолжительность в днях
   */
  getDurationInDays(): number {
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Учитываем оба конца диапазона
  }

  /**
   * Метод для проверки пересечения с другим диапазоном дат
   * @param other - Другой диапазон дат
   * @returns {boolean} True, если диапазоны пересекаются
   */
  overlaps(other: DateRange): boolean {
    return this.startDate <= other.endDate && other.startDate <= this.endDate;
  }

  /**
   * Метод для получения строкового представления диапазона дат
   * @returns {string} Строковое представление диапазона
   */
  toString(): string {
    return `С ${this.startDate.toLocaleDateString()} по ${this.endDate.toLocaleDateString()}`;
  }

  /**
   * Метод для проверки, содержится ли указанная дата в диапазоне
   * @param date - Дата для проверки
   * @returns {boolean} True, если дата содержится в диапазоне
   */
  contains(date: Date): boolean {
    // Проверяем , что дата находится между начальной и конечной датами включительно
    return date >= this.startDate && date <= this.endDate;
  }

  /**
   * Метод для сравнения с другим диапазоном дат
   * @param other - Другой диапазон дат
   * @returns {boolean} True, если диапазоны равны
   */
  equals(other: DateRange): boolean {
    return (
      this.startDate.getTime() === other.startDate.getTime() &&
      this.endDate.getTime() === other.endDate.getTime()
    );
  }

  /**
   * Метод для проверки валидности диапазона дат
   * @param startDate - Начальная дата
   * @param endDate - Конечная дата
   * @returns {boolean} True, если диапазон валиден
   */
  static isValid(startDate: Date, endDate: Date): boolean {
    return startDate <= endDate;
  }
}
