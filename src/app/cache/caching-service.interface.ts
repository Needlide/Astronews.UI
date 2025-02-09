export interface ICachingService<T> {
  setPagination(page: number, value: T, ttl?: number): void;

  setSearch(key: string, value: T, page?: number, ttl?: number): void;

  getPagination(page: number): T | null;

  getSearch(key: string, page?: number): T | null;

  // Delete the cached pagination and related search data
  deletePagination(page: number): void;

  // Delete the cached search data for a specific page and key
  deleteSearch(key: string, page: number): void;

  clearPagination(): void;

  clearSearch(): void;
}
