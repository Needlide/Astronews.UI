import { Injectable } from '@angular/core';
import { CachingService } from '../cache/caching.service';
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
import { catchError, map, Observable, of } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { parseSearchTerm, parseSearchValue } from './search.util';
import { ErrorService } from '../error.service';
import { convertDateToString, isISO8601Date } from '../shared/date-functions';
import { NewsModel } from '../models/news/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsSearchService {
  constructor(
    private cacheService: CachingService,
    private dataService: DataService,
    private promptService: PromptService,
    private router: Router,
    private errorService: ErrorService,
    private urlBuilder: UrlBuilderService
  ) {}

  search(term: string): Observable<NewsModel[]> {
    if (!term || term.length < minSymbolsToTriggerSearch) {
      let defaultCache = this.cacheService.get(
        PAGE_KEYS.NEWS,
        DEFAULT_CACHE_KEYS.NEWS
      ) as NewsModel[];

      if (defaultCache) {
        return of(defaultCache);
      } else {
        let defaultUrl = this.urlBuilder.getNewsUrl();
        return this.apiCall(defaultUrl, DEFAULT_CACHE_KEYS.NEWS);
      }
    }

    let cache = this.cacheService.get(PAGE_KEYS.NEWS, term) as NewsModel[];

    if (cache) {
      return of(cache);
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

        return this.apiCall(urlT, term);
      case 'ns':
        let urlNs = this.urlBuilder.getNewsUrl(
          undefined,
          parseSearchValue(value)
        );
        return this.apiCall(urlNs, term);
      case 's':
        let urlS = this.urlBuilder.getNewsUrl(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          parseSearchValue(value)
        );
        return this.apiCall(urlS, term);
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
            return this.apiCall(urlP, term);
          } else {
            let urlP = this.urlBuilder.getNewsUrl(
              undefined,
              undefined,
              convertDateToString(firstDate),
              convertDateToString(secondDate)
            );
            return this.apiCall(urlP, term);
          }
        }
        return of([] as NewsModel[]);
      case 'pb':
        let urlPb = this.urlBuilder.getNewsUrl(
          undefined,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlPb, term);
      case 'pa':
        let urlPa = this.urlBuilder.getNewsUrl(undefined, undefined, value);
        return this.apiCall(urlPa, term);
      default:
        let urlSearchDefault = this.urlBuilder.getNewsUrl(
          undefined,
          undefined,
          undefined,
          undefined,
          value
        );
        return this.apiCall(urlSearchDefault, DEFAULT_CACHE_KEYS.NEWS);
    }
  }

  private apiCall(url: string, key: string): Observable<NewsModel[]> {
    return this.dataService.getNews(url).pipe(
      map((responseData) => {
        if (responseData.count == 0) {
          return [];
        }

        this.promptService.NewsNext = responseData.next;
        this.promptService.NewsPrev = responseData.previous;

        this.cacheService.set(PAGE_KEYS.NEWS, key, responseData.results);

        return responseData.results;
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);
        this.router.navigate([errorUrl], {
          state: { returnUrl: errorUrlNews },
        });

        return [];
      })
    );
  }
}
