import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private cache: Map<string, Map<string, any>> = new Map();

  constructor() {}

  /**
   * Set the cache value for the specified page with expiration time.
   *
   * @param page Key for the page which data needs to be set.
   * @param key Key for the data to be set.
   * @param value Value which needs to be cached.
   * @param ttl Optional parameter Time-To-Live in milliseconds. Default value is 600_000 (10 minutes).
   */
  set(page: string, key: string, value: any, ttl: number = 600_000): void {
    const pageCache = this.cache.get(page) || new Map<string, any>();
    const expiry = Date.now() + ttl;
    pageCache.set(key, { value, expiry });

    setTimeout(() => {
      pageCache.delete(key);
      if (pageCache.size === 0) {
        this.clearPage(page);
      }
    }, ttl);

    this.cache.set(page, pageCache);
  }

  /**
   * Retrieves the cached value for the specified page and key.
   * If the cache entry has expired or does not exist, returns `null`.
   *
   * @param {string} page The key representing the page from which to retrieve data.
   * @param {string} key The key associated with the cached data to retrieve.
   * @returns {any | null} The cached value if it exists and is not expired; otherwise, `null`.
   */
  get(page: string, key: string): any | null {
    const pageCache = this.cache.get(page);
    if (!pageCache) {
      return null;
    }

    const entry = pageCache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      pageCache.delete(key);

      if (pageCache.size === 0) {
        this.clearPage(page);
      }
      return null;
    }

    return entry.value;
  }

  clearPage(page: string): void {
    this.cache.delete(page);
  }

  // clear all the values from the cache
  clearAll(): void {
    this.cache.clear();
  }

  delete(page: string, key: string): void {
    const pageCache = this.cache.get(page);
    if (pageCache) {
      pageCache.delete(key);

      if (pageCache.size === 0) {
        this.cache.delete(page);
      }
    }
  }
}
