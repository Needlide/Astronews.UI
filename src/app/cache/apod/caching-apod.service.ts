import { Injectable } from '@angular/core';
import { ICachingService } from '../caching-service.interface';
import { ApodModel } from '@/app/models/apod/apod.model';
import { ApodCache } from '@/app/models/cache/apod-cache.model';

@Injectable({
  providedIn: 'root',
})
export class CachingApodService implements ICachingService<ApodModel[]> {
  constructor() {}

  // key - page number, value - page's data
  private _paginationCache: Map<number, ApodCache> = new Map();

  // key - page number, value - (key - search term, value - search data)
  private _searchCache: Map<number, Map<string, ApodCache>> = new Map();

  // 3_600_000 = 1 hour
  private readonly _ttl = 3_600_000;

  setPagination(
    page: number,
    value: ApodModel[],
    ttl: number = this._ttl
  ): void {
    const expiry = Date.now() + ttl;

    this._paginationCache.set(page, { data: value, expiry });
  }

  setSearch(
    key: string,
    value: ApodModel[],
    page: number,
    ttl: number = this._ttl
  ): void {
    const pageCache =
      this._searchCache.get(page) || new Map<string, ApodCache>();
    const expiry = Date.now() + ttl;

    pageCache.set(key.toLowerCase(), { data: value, expiry });
    this._searchCache.set(page, pageCache);
  }

  getPagination(page: number): ApodModel[] | null {
    const cache = this._paginationCache.get(page);

    if (!cache) {
      return null;
    }

    if (Date.now() > cache.expiry) {
      this._paginationCache.delete(page);
      return null;
    }

    return cache.data;
  }

  getSearch(key: string, page: number): ApodModel[] | null {
    const pageCache = this._searchCache.get(page);

    if (!pageCache) {
      return null;
    }

    const cache = pageCache.get(key.toLowerCase());

    if (!cache) {
      return null;
    }

    if (Date.now() > cache.expiry) {
      pageCache.delete(key.toLowerCase());

      pageCache.size === 0
        ? this._searchCache.delete(page)
        : this._searchCache.set(page, pageCache);

      return null;
    }

    return cache.data;
  }

  deletePagination(page: number): void {
    this._paginationCache.delete(page);
  }

  deleteSearch(key: string, page: number): void {
    const pageCache = this._searchCache.get(page);

    if (pageCache) {
      pageCache.delete(key.toLowerCase());

      this._searchCache.set(page, pageCache);
    }
  }

  clearPagination(): void {
    this._paginationCache.clear();
  }

  clearSearch(): void {
    this._searchCache.clear();
  }
}
