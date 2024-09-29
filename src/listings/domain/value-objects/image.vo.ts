export class Image {
  constructor(
    private url: string,
    private description: string,
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (!this.url.trim()) {
      throw new Error('URL не может быть пустым.');
    }
    if (!this.description.trim()) {
      throw new Error('Описание не может быть пустым.');
    }
  }

  getUrl(): string {
    return this.url;
  }

  getDescription(): string {
    return this.description;
  }
}
