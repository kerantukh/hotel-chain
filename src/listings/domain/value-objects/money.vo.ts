export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {
    if (amount < 0) {
      throw new Error('Сумма не может быть отрицательной');
    }
    if (currency.length !== 3) {
      throw new Error(
        'Валюта должна быть в формате ISO 4217 (например, USD, EUR, RUB)',
      );
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Нельзя складывать деньги разных валют');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
}
