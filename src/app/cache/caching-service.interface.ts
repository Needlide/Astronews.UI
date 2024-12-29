export interface ICachingService<T> {
  // key - page number, value - page's data
  paginationCache: Map<number, T>;
  // key - page number, value - (key - search term, value - search data)
  searchCache: Map<number, Map<string, T>>;

  setPagination(page: number, value: T, ttl: number): void;

  setSearch(page: number, key: string, value: T, ttl: number): void;

  getPagination(page: number): T | null;

  getSearch(page: number, key: string): T | null;

  deletePagination(page: number): void; // deletes search tied to page too

  deleteSearch(page: number, key: string): void;

  clear(): void;
}
