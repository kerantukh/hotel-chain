/**
 * Класс для представления рейтинга
 */
export class Score {
  /**
   * Конструктор принимает значение рейтинга
   * @param value - Значение рейтинга
   */
  constructor(private readonly value: number) {
    this.validate(value); // Валидация значения рейтинга
  }

  /**
   * Метод для валидации значения рейтинга
   * @param value - Значение рейтинга
   * @throws {Error} Если значение рейтинга вне диапазона
   */
  private validate(value: number): void {
    if (!Score.isValid(value)) {
      throw new Error('Рейтинг должен быть в диапазоне от 0 до 10'); // Ошибка, если рейтинг вне диапазона
    }
  }

  /**
   * Метод для получения значения рейтинга
   * @returns {number} Значение рейтинга
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Метод для сравнения двух рейтингов
   * @param other - Другой рейтинг
   * @returns {boolean} True, если рейтинги равны
   */
  equals(other: Score): boolean {
    return this.value === other.value;
  }

  /**
   * Метод для представления рейтинга в виде строки
   * @returns {string} Строковое представление рейтинга
   */
  toString(): string {
    return `Рейтинг: ${this.value}`;
  }

  /**
   * Метод для получения рейтинга в виде процента
   * @returns {string} Рейтинг в процентах
   */
  toPercentage(): string {
    return `${(this.value * 10).toFixed(1)}%`;
  }

  /**
   * Метод для проверки валидности значения рейтинга
   * @param value - Значение рейтинга
   * @returns {boolean} True, если рейтинг валиден
   */
  static isValid(value: number): boolean {
    return value >= 0 && value <= 10;
  }
}
