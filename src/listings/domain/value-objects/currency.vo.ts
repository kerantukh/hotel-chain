import { CurrencyEnum } from '../enums/currency.enum';

export class Currency {
  constructor(private value: CurrencyEnum) {}

  getValue(): CurrencyEnum {
    return this.value;
  }

  equals(other: Currency): boolean {
    this.validateInvariants(other);
    return this.value === other.value;
  }

  equalsValue(value: CurrencyEnum): boolean {
    return this.value === value;
  }

  private validateInvariants(other: Currency): void {
    if (!other) {
      throw new Error('Сравниваемый объект не может быть пустым.');
    }
  }
}
