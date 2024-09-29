import { CurrencyEnum } from '../enums/currency.enum';
import { InvalidCurrencyException } from '../exceptions/invalid-currency.exception';

/**
 * Класс для представления валюты
 */
export class Currency {
  /**
   * Конструктор принимает значение валюты
   * @param value - Значение валюты
   */
  constructor(private value: CurrencyEnum) {
    this.validateValue(); // Валидация значения валюты
  }

  /**
   * Метод для валидации значения валюты
   * @throws {InvalidCurrencyException} Если значение валюты некорректно
   */
  private validateValue(): void {
    if (!Currency.isValid(this.value)) {
      throw new InvalidCurrencyException(this.value); // Исключение при некорректной валюте
    }
  }

  /**
   * Метод для получения значения валюты
   * @returns {CurrencyEnum} Значение валюты
   */
  getValue(): CurrencyEnum {
    return this.value;
  }

  /**
   * Метод для сравнения с другой валютой
   * @param other - Другая валюта
   * @returns {boolean} True, если валюты равны
   * @throws {Error} Если сравниваемый объект пустой
   */
  equals(other: Currency): boolean {
    if (!other) {
      throw new Error('Сравниваемый объект не может быть пустым.'); // Исключение при пустом объекте
    }
    return this.value === other.value;
  }

  /**
   * Метод для сравнения с другим значением валюты
   * @param value - Значение валюты
   * @returns {boolean} True, если значения валют равны
   */
  equalsValue(value: CurrencyEnum): boolean {
    return this.value === value;
  }

  /**
   * Статический метод для проверки валидности значения валюты
   * @param value - Значение валюты
   * @returns {boolean} True, если значение валюты валидно
   */
  static isValid(value: any): boolean {
    return Object.values(CurrencyEnum).includes(value);
  }
}
