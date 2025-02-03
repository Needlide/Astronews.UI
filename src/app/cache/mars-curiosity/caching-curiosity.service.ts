import { Injectable } from '@angular/core';
import { ICachingService } from '../caching-service.interface';
import { MarsModel } from '@/app/models/mars/mars.model';
import { MarsCuriosityCache } from '@/app/models/cache/mars-curiosity.model';

@Injectable({
  providedIn: 'root',
})
export class CachingCuriosityService implements ICachingService<MarsModel[]> {
  private _paginationCache: Map<number, MarsCuriosityCache> = new Map();
  private _searchCache: Map<number, Map<string, MarsCuriosityCache>> =
    new Map();

  // 21_600_000 = 6 hours
  private readonly _ttl = 21_600_000;

  constructor() {}

  setPagination(
    page: number,
    value: MarsModel[],
    ttl: number = this._ttl
  ): void {
    const expiry = Date.now() + ttl;

    this._paginationCache.set(page, { data: value, expiry });
  }

  setSearch(
    page: number,
    key: string,
    value: MarsModel[],
    ttl: number = this._ttl
  ): void {
    const pageCache =
      this._searchCache.get(page) || new Map<string, MarsCuriosityCache>();
    const expiry = Date.now() + ttl;

    pageCache.set(key.toLowerCase(), { data: value, expiry });
    this._searchCache.set(page, pageCache);
  }

  getPagination(page: number): MarsModel[] | null {
    return this.getValidCache(this._paginationCache.get(page));
  }

  getSearch(page: number, key: string): MarsModel[] | null {
    const pageCache = this._searchCache.get(page);

    const cache = pageCache ? pageCache.get(key.toLowerCase()) : undefined;
    return this.getValidCache(cache);
  }

  deletePagination(page: number): void {
    this._paginationCache.delete(page);
  }

  deleteSearch(page: number, key: string): void {
    const pageCache = this._searchCache.get(page);

    if (pageCache) {
      pageCache.delete(key.toLowerCase());

      if (pageCache.size === 0) {
        this._searchCache.delete(page);
      } else {
        this._searchCache.set(page, pageCache);
      }
    }
  }

  clearPagination(): void {
    this._paginationCache.clear();
  }

  clearSearch(): void {
    this._searchCache.clear();
  }

  private getValidCache(
    cache: MarsCuriosityCache | undefined
  ): MarsModel[] | null {
    if (!cache) return null;
    if (Date.now() > cache.expiry) return null;
    return cache.data;
  }
}
