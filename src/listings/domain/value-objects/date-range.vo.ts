export class DateRange {
  constructor(
    private readonly startDate: Date, // Начальная дата диапазона
    private readonly endDate: Date, // Конечная дата диапазона
  ) {
    // Проверка, что начальная дата не позже конечной
    if (startDate > endDate) {
      throw new Error('Дата начала не может быть позже даты окончания');
    }
  }

  // Метод для получения начальной даты
  getStartDate(): Date {
    return this.startDate;
  }

  // Метод для получения конечной даты
  getEndDate(): Date {
    return this.endDate;
  }

  // Метод для получения продолжительности в днях
  getDurationInDays(): number {
    const diffTime = Math.abs(
      this.endDate.getTime() - this.startDate.getTime(),
    );
    // Возвращаем количество дней
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Метод для проверки пересечения с другим диапазоном дат
  overlaps(other: DateRange): boolean {
    return this.startDate <= other.endDate && other.startDate <= this.endDate;
  }
}
