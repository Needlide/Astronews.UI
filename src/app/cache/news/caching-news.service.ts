import { NewsCache } from '@/app/models/cache/news-cache.model';
import { NewsModel } from '@/app/models/news/news.model';
import { Injectable } from '@angular/core';
import { ICachingService } from '../caching-service.interface';

@Injectable({
  providedIn: 'root',
})
export class CachingNewsService implements ICachingService<NewsModel[]> {
  private _paginationCache: Map<number, NewsCache> = new Map();
  private _searchCache: Map<number, Map<string, NewsCache>> = new Map();

  // 300_000 = 5 minutes
  private readonly _ttl = 300_000;

  constructor() {}

  setPagination(
    page: number,
    value: NewsModel[],
    ttl: number = this._ttl
  ): void {
    const expiry = Date.now() + ttl;

    this._paginationCache.set(page, { data: value, expiry });
  }

  setSearch(
    page: number,
    key: string,
    value: NewsModel[],
    ttl: number = this._ttl
  ): void {
    const pageCache =
      this._searchCache.get(page) || new Map<string, NewsCache>();
    const expiry = Date.now() + ttl;

    pageCache.set(key.toLowerCase(), { data: value, expiry });
    this._searchCache.set(page, pageCache);
  }

  getPagination(page: number): NewsModel[] | null {
    return this.getValidCache(this._paginationCache.get(page));
  }

  getSearch(page: number, key: string): NewsModel[] | null {
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

  private getValidCache(cache: NewsCache | undefined): NewsModel[] | null {
    if (!cache) return null;
    if (Date.now() > cache.expiry) return null;
    return cache.data;
  }
}
