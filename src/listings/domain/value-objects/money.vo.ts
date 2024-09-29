import { CurrencyEnum } from '../enums/currency.enum';
import { Currency } from './currency.vo';

/**
 * Класс для представления денежных сумм с валютой
 */
export class Money {
  /**
   * Конструктор принимает сумму денег и валюту
   * @param amount - Сумма денег
   * @param currency - Валюта в формате ISO 4217
   */
  constructor(
    private readonly amount: number,
    private readonly currency: Currency,
  ) {
    this.validate(); // Валидация входных данных
  }

  /**
   * Метод для получения суммы денег
   * @returns {number} Сумма денег
   */
  getAmount(): number {
    return this.amount;
  }

  /**
   * Метод для получения валюты
   * @returns {Currency} Валюта
   */
  getCurrency(): Currency {
    return this.currency;
  }

  /**
   * Метод для проверки корректности данных
   * @returns {boolean} True, если данные валидны
   */
  isValid(): boolean {
    return Money.isValid(this.amount, this.currency);
  }

  /**
   * Метод для проверки корректности данных
   * @param amount - Сумма денег
   * @param currency - Валюта
   * @returns {boolean} True, если данные валидны
   */
  static isValid(amount: number, currency: Currency): boolean {
    return amount >= 0 && Money.isValidCurrency(currency);
  }

  /**
   * Метод для сравнения сумм денег
   * @param other - Другая сумма денег
   * @returns {boolean} True, если суммы равны
   */
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency.equals(other.currency);
  }

  /**
   * Метод для сложения сумм денег
   * @param other - Другая сумма денег
   * @returns {Money} Новая сумма денег
   */
  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Метод для проверки валидности валюты
   * @param currency - Валюта
   * @returns {boolean} True, если валюта валидна
   */
  private static isValidCurrency(currency: Currency): boolean {
    return Object.values(CurrencyEnum).includes(currency.getValue());
  }

  /**
   * Метод для проверки совпадения валют
   * @param other - Другая сумма денег
   * @throws {Error} Если валюты не совпадают
   */
  private ensureSameCurrency(other: Money): void {
    if (!this.currency.equals(other.currency)) {
      throw new Error('Нельзя оперировать деньгами разных валют');
    }
  }

  /**
   * Метод для умножения суммы денег
   * @param multiplier - Множитель
   * @returns {Money} Новая сумма денег
   */
  multiply(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency);
  }

  /**
   * Метод для деления суммы денег
   * @param divisor - Делитель
   * @returns {Money} Новая сумма денег
   * @throws {Error} Если делитель равен нулю
   */
  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Деление на ноль недопустимо');
    }
    return new Money(this.amount / divisor, this.currency);
  }

  /**
   * Метод для вычитания сумм денег
   * @param other - Другая сумма денег
   * @returns {Money} Новая сумма денег
   */
  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  /**
   * Метод для конвертации суммы денег
   * @param targetCurrency - Целевая валюта
   * @returns {Money} Новая сумма денег в целевой валюте
   */
  convertTo(targetCurrency: Currency): Money {
    const conversionRate = this.getConversionRate(
      this.currency,
      targetCurrency,
    );
    return new Money(this.amount * conversionRate, targetCurrency);
  }

  /**
   * Метод для получения курса конвертации
   * @param sourceCurrency - Исходная валюта
   * @param targetCurrency - Целевая валюта
   * @returns {number} Курс конвертации
   */
  private getConversionRate(
    sourceCurrency: Currency,
    targetCurrency: Currency,
  ): number {
    // Реализация получения курса конвертации
    // Этот метод должен быть реализован в зависимости от источника данных о курсах
    return 1.0; // Пример: 1 единица sourceCurrency равна 1 единице targetCurrency
  }

  /**
   * Метод для проверки корректности данных
   * @throws {Error} Если данные некорректны
   */
  private validate(): void {
    if (!this.isValid()) {
      throw new Error('Некорректные данные для суммы денег');
    }
  }
}
