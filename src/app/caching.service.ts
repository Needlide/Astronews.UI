import { Injectable } from '@angular/core';

interface CacheEntry {
  value: any;
  expiry: number;
}

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private cache: Map<string, Map<string, CacheEntry>> = new Map();

  constructor() {}

  // set the caching value with optional "time to last" parameter
  set(page: string, key: string, value: any, ttl: number = 600000): void {
    const pageCache = this.cache.get(page) || new Map();
    const expiry = Date.now() + ttl;
    pageCache.set(key, { value, expiry });

    setTimeout(() => {
      pageCache.delete(key);
      if (pageCache.size === 0) {
        this.cache.delete(page);
      }
    }, ttl);
  }

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
        this.cache.delete(page);
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
