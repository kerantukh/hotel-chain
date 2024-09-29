export class InvalidListingDataException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidListingDataException';
  }
}
