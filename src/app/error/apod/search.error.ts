export class SearchError extends Error {
  constructor(message: string, public invalidPrefix?: string) {
    super(message);
    this.name = 'SearchError';
  }
}
