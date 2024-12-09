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

    let cache = this.cacheService.get(PAGE_KEYS.NEWS, term);

    // TODO update the prompt service variables of news next and previous with a data from cache

    if (cache) {
      //this.promptService.NewsNext = cache.nextUrl;
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
        // TODO make scenarios for published after/published before only
        // date standart is ISO8601 for the news api
        // move method from mars search to a shared directory
        if (dates.length == 2) {
          let urlP = this.urlBuilder.getNewsUrl(
            undefined,
            undefined,
            dates[0],
            dates[1]
          );

          return this.apiCall(urlP);
        } else if ()
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
