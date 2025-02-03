export interface ICachingService<T> {
  setPagination(page: number, value: T, ttl?: number): void;

  setSearch(page: number, key: string, value: T, ttl?: number): void;

  getPagination(page: number): T | null;

  getSearch(page: number, key: string): T | null;

  // Delete the cached pagination and related search data
  deletePagination(page: number): void;

  // Delete the cached search data for a specific page and key
  deleteSearch(page: number, key: string): void;

  clearPagination(): void;

  clearSearch(): void;
}
