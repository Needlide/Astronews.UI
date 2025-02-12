import { Injectable } from '@angular/core';
import { ICachingService } from '../caching-service.interface';
import { GalleryCache } from '@/app/models/cache/gallery-cache.model';
import { Data } from '@/app/models/gallery/gallery.root.model';

@Injectable({
  providedIn: 'root',
})
export class CachingGalleryService implements ICachingService<Data[]> {
  private _paginationCache: Map<number, GalleryCache> = new Map();
  private _searchCache: Map<number, Map<string, GalleryCache>> = new Map();

  // 3_600_000 = 1 hour
  private readonly _ttl = 3_600_000;

  constructor() {}

  setPagination(page: number, value: Data[], ttl: number = this._ttl): void {
    const expiry = Date.now() + ttl;

    this._paginationCache.set(page, { data: value, expiry });
  }

  setSearch(
    key: string,
    value: Data[],
    page: number,
    ttl: number = this._ttl
  ): void {
    const pageCache =
      this._searchCache.get(page) || new Map<string, GalleryCache>();
    const expiry = Date.now() + ttl;

    pageCache.set(key.toLowerCase(), { data: value, expiry });
    this._searchCache.set(page, pageCache);
  }

  getPagination(page: number): Data[] | null {
    return this.getValidCache(this._paginationCache.get(page));
  }

  getSearch(key: string, page: number): Data[] | null {
    const pageCache = this._searchCache.get(page);

    const cache = pageCache ? pageCache.get(key.toLowerCase()) : undefined;
    return this.getValidCache(cache);
  }

  deletePagination(page: number): void {
    this._paginationCache.delete(page);
  }

  deleteSearch(key: string, page: number): void {
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

  private getValidCache(cache: GalleryCache | undefined): Data[] | null {
    if (!cache) return null;
    if (Date.now() > cache.expiry) return null;
    return cache.data;
  }
}
