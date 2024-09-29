export class ListingNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ListingNotFoundException';
  }
}
