export class CacheError extends Error {
  constructor(message: string, public pageNumber?: number) {
    super(message);
    this.name = 'CacheError';
  }
}
