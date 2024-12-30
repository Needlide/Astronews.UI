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

  // 1_800_000 = 30 minutes
  private readonly _ttl = 1_800_000;

  setPagination(
    page: number,
    value: ApodModel[],
    ttl: number = this._ttl
  ): void {
    const expiry = Date.now() + ttl;

    this._paginationCache.set(page, { data: value, expiry });
  }

  setSearch(
    page: number,
    key: string,
    value: ApodModel[],
    ttl: number = this._ttl
  ): void {
    const pageCache =
      this._searchCache.get(page) || new Map<string, ApodCache>();
    const expiry = Date.now() + ttl;

    pageCache.set(key, { data: value, expiry });
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

  getSearch(page: number, key: string): ApodModel[] | null {
    const pageCache = this._searchCache.get(page);

    if (!pageCache) {
      return null;
    }

    const cache = pageCache.get(key);

    if (!cache) {
      return null;
    }

    if (Date.now() > cache.expiry) {
      pageCache.delete(key);

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

  deleteSearch(page: number, key: string): void {
    const pageCache = this._searchCache.get(page);

    if (pageCache) {
      pageCache.delete(key);

      this._searchCache.set(page, pageCache);
    }
  }

  clear(): void {
    this._paginationCache.clear();
    this._searchCache.clear();
  }
}
