import { Injectable } from '@angular/core';

interface CacheEntry {
  value: any;
  expiry: number;
}

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private cache: Map<string, CacheEntry> = new Map();

  constructor() {}

  // set the caching value with optional "time to last" parameter
  set(key: string, value: any, ttl: number = 600000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });

    setTimeout(() => {
      this.cache.delete(key);
    }, ttl);
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  // clear all the values from the cache
  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}
