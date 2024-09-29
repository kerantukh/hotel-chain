export class InvalidCurrencyException extends Error {
  constructor(value: any) {
    super(`Некорректная валюта: ${value}`);
    this.name = 'InvalidCurrencyException';
  }
}
