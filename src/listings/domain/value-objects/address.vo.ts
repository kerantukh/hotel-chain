/**
 * Класс для представления адреса
 */
export class Address {
  /**
   * Конструктор принимает компоненты адреса
   * @param houseNumber - Номер дома
   * @param street - Улица
   * @param city - Город
   * @param state - Штат
   * @param country - Страна
   * @param zipCode - Почтовый индекс
   */
  constructor(
    private readonly houseNumber: string,
    private readonly street: string,
    private readonly city: string,
    private readonly state: string,
    private readonly country: string,
    private readonly zipCode: string,
  ) {
    this.validateInvariants(); // Проверка инвариантов
  }

  /**
   * Метод для проверки инвариантов объекта Address
   * @throws {Error} Если инварианты нарушены
   */
  private validateInvariants(): void {
    if (!this.isValid()) {
      throw new Error('Некорректный адрес');
    }
  }

  /**
   * Метод для получения полного адреса в виде строки
   * @returns {string} Полный адрес
   */
  getFullAddress(): string {
    return `${this.houseNumber} ${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }

  /**
   * Метод для сравнения двух адресов
   * @param other - Другой адрес
   * @returns {boolean} True, если адреса равны
   */
  equals(other: Address): boolean {
    return (
      this.houseNumber === other.houseNumber &&
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.country === other.country &&
      this.zipCode === other.zipCode
    );
  }

  /**
   * Метод для проверки валидности адреса
   * @returns {boolean} True, если адрес валиден
   */
  isValid(): boolean {
    return (
      this.houseNumber.trim().length > 0 &&
      this.street.trim().length > 0 &&
      this.city.trim().length > 0 &&
      this.state.trim().length > 0 &&
      this.country.trim().length > 0 &&
      /^\d{5}(-\d{4})?$/.test(this.zipCode)
    );
  }
}
