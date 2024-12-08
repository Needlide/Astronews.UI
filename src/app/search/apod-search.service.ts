import { Injectable } from '@angular/core';
import { CachingService } from '../cache/caching.service';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { SearchService } from './search.service';
import { ApodModel } from '../models/apod/apod.model';
import { parseSearchTerm } from './search.util';
import { minSymbolsToTriggerSearch } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class ApodSearchService {
  constructor(
    private cacheService: CachingService,
    private searchService: SearchService
  ) {}

  search(): ApodModel[] {
    let term = this.searchService.getSearchTerm();

    if (!term || term.length < minSymbolsToTriggerSearch) {
      return [];
    }

    let cache = this.cacheService.get(PAGE_KEYS.APOD, term);

    if (cache) {
      return cache as ApodModel[];
    }

    let defaultCache = this.cacheService.get(
      PAGE_KEYS.APOD,
      DEFAULT_CACHE_KEYS.APOD
    );

    if (!defaultCache) {
      return [];
    }

    const { property, value } = parseSearchTerm(term);

    switch (property?.toLowerCase()) {
      // filter by title
      case 't':
        let t_filteredData = defaultCache.filter((item: ApodModel) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.set(PAGE_KEYS.APOD, term, t_filteredData);
        return t_filteredData;
      // filter by explanation
      case 'e':
        let e_filteredData = defaultCache.filter((item: ApodModel) =>
          item.explanation.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.set(PAGE_KEYS.APOD, term, e_filteredData);
        return e_filteredData;
      // filter by copyright
      case 'c':
        let c_filteredData = defaultCache.filter((item: ApodModel) =>
          item.copyright.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.set(PAGE_KEYS.APOD, term, c_filteredData);
        return c_filteredData;
      // filter by date
      case 'd':
        let d_filteredData = defaultCache.filter((item: ApodModel) =>
          item.date.includes(value)
        );
        this.cacheService.set(PAGE_KEYS.APOD, term, d_filteredData);
        return d_filteredData;
      default:
        return [];
    }
  }
}
