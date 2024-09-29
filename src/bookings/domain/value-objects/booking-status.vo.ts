export class BookingStatus {
  private readonly status: string;

  constructor(status: string) {
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Недопустимый статус бронирования: ${status}`);
    }
    this.status = status;
  }

  getStatus(): string {
    return this.status;
  }
}
