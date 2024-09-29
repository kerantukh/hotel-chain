export class Coordinates {
  constructor(
    private latitude: number,
    private longitude: number,
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (this.latitude < -90 || this.latitude > 90) {
      throw new Error('Широта должна быть в диапазоне от -90 до 90 градусов.');
    }
    if (this.longitude < -180 || this.longitude > 180) {
      throw new Error(
        'Долгота должна быть в диапазоне от -180 до 180 градусов.',
      );
    }
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  equals(other: Coordinates): boolean {
    return (
      this.latitude === other.latitude && this.longitude === other.longitude
    );
  }
}
