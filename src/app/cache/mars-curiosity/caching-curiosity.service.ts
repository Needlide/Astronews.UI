import { Injectable } from '@angular/core';
import { ICachingService } from '../caching-service.interface';
import { MarsModel } from '@/app/models/mars/mars.model';
import { MarsCuriosityCache } from '@/app/models/cache/mars-curiosity.model';

@Injectable({
  providedIn: 'root',
})
export class CachingCuriosityService implements ICachingService<MarsModel[]> {
  private _paginationCache: Map<number, MarsCuriosityCache> = new Map();
  private _searchCache: Map<string, MarsCuriosityCache> = new Map();

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

  setSearch(key: string, value: MarsModel[], ttl: number = this._ttl): void {
    const expiry = Date.now() + ttl;

    this._searchCache.set(key, { data: value, expiry });
  }

  getPagination(page: number): MarsModel[] | null {
    return this.getValidCache(this._paginationCache.get(page));
  }

  getSearch(key: string): MarsModel[] | null {
    const cache = this._searchCache.get(key);

    return this.getValidCache(cache);
  }

  deletePagination(page: number): void {
    this._paginationCache.delete(page);
  }

  deleteSearch(key: string): void {
    this._searchCache.delete(key);
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
