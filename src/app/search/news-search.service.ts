import { Injectable } from '@angular/core';
import { CachingService } from '../cache/caching.service';
import { SearchService } from './search.service';
import { DataService } from '../data.service';
import { PromptService } from '../shared/prompt.service';
import { Router } from '@angular/router';
import { UrlBuilderService } from '../url-builder.service';
import {
  errorMessageDataFetch,
  errorUrl,
  errorUrlNews,
  minSymbolsToTriggerSearch,
} from '../shared/constants';
import { catchError, map, of } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { parseSearchTerm, parseSearchValue } from './search.util';
import { ErrorService } from '../error.service';
import { NewsCache } from '../models/cache/news-cache.model';
import {
  convertDateToString,
  isISO8601Date,
} from '../shared/iso8601-date-functions';

@Injectable({
  providedIn: 'root',
})
export class NewsSearchService {
  constructor(
    private cacheService: CachingService,
    private searchService: SearchService,
    private dataService: DataService,
    private promptService: PromptService,
    private router: Router,
    private errorService: ErrorService,
    private urlBuilder: UrlBuilderService
  ) {}

  search() {
    let term = this.searchService.getSearchTerm();

    if (!term || term.length < minSymbolsToTriggerSearch) {
      return of([]);
    }

    let cache = this.cacheService.get(PAGE_KEYS.NEWS, term) as NewsCache;

    if (cache) {
      this.promptService.NewsNext = cache.nextUrl;
      this.promptService.NewsPrev = cache.prevUrl;
      return of(cache);
    }

    let defaultCache = this.cacheService.get(
      PAGE_KEYS.NEWS,
      DEFAULT_CACHE_KEYS.NEWS
    );

    if (!defaultCache) {
      return of([]);
    }

    const { property, value } = parseSearchTerm(term);

    switch (property?.toLowerCase()) {
      case 't':
        let urlT = this.urlBuilder.getNewsUrl(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          parseSearchValue(value)
        );

        return this.apiCall(urlT);
      case 'ns':
        let urlNs = this.urlBuilder.getNewsUrl(
          undefined,
          parseSearchValue(value)
        );
        return this.apiCall(urlNs);
      case 's':
        let urlS = this.urlBuilder.getNewsUrl(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          parseSearchValue(value)
        );
        return this.apiCall(urlS);
      case 'p':
        let dates = parseSearchValue(value);
        if (
          dates.length == 2 &&
          isISO8601Date(dates[0]) &&
          isISO8601Date(dates[1])
        ) {
          let firstDate = new Date(dates[0]);
          let secondDate = new Date(dates[1]);

          if (firstDate < secondDate) {
            let urlP = this.urlBuilder.getNewsUrl(
              undefined,
              undefined,
              convertDateToString(firstDate),
              convertDateToString(secondDate)
            );
            return this.apiCall(urlP);
          } else {
            let urlP = this.urlBuilder.getNewsUrl(
              undefined,
              undefined,
              convertDateToString(firstDate),
              convertDateToString(secondDate)
            );
            return this.apiCall(urlP);
          }
        }
        return of([]);
      case 'pb':
        let urlPb = this.urlBuilder.getNewsUrl(
          undefined,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlPb);
      case 'pa':
        let urlPa = this.urlBuilder.getNewsUrl(undefined, undefined, value);
        return this.apiCall(urlPa);
      default:
        return of([]);
    }
  }

  private apiCall(url: string) {
    return this.dataService.getNews(url).pipe(
      map((responseData) => {
        if (responseData.count == 0) {
          return of([]);
        }

        this.promptService.NewsNext = responseData.next;
        this.promptService.NewsPrev = responseData.previous;

        return of(responseData.results);
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);
        this.router.navigate([errorUrl], {
          state: { returnUrl: errorUrlNews },
        });

        return of([]);
      })
    );
  }
}
