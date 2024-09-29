// Класс для представления рейтинга
export class Score {
  // Конструктор принимает значение рейтинга
  constructor(private readonly value: number) {
    this.validate(value); // Валидация значения рейтинга
  }

  // Метод для валидации значения рейтинга
  private validate(value: number): void {
    if (value < 0 || value > 10) {
      throw new Error('Рейтинг должен быть в диапазоне от 0 до 10'); // Ошибка, если рейтинг вне диапазона
    }
  }

  // Метод для получения значения рейтинга
  getValue(): number {
    return this.value;
  }

  // Метод для сравнения двух рейтингов
  equals(other: Score): boolean {
    return this.value === other.value; // Возвращает true, если рейтинги равны
  }

  // Метод для представления рейтинга в виде строки
  toString(): string {
    return `Рейтинг: ${this.value}`; // Возвращает строку с рейтингом
  }

  // Метод для получения рейтинга в виде процента
  toPercentage(): string {
    return `${(this.value * 10).toFixed(1)}%`; // Возвращает рейтинг в процентах
  }
}
