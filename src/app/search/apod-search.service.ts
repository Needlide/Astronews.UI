import { Injectable } from '@angular/core';
import { CachingService } from '../cache/caching.service';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { ApodModel } from '../models/apod/apod.model';
import { parseSearchTerm } from './search.util';
import {
  errorMessageDataFetch,
  minSymbolsToTriggerSearch,
} from '../shared/constants';
import { catchError, map, Observable, of } from 'rxjs';
import { DataService } from '../data.service';
import { subtractDayFromDate } from '../shared/date-functions';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { ROUTES } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class ApodSearchService {
  constructor(
    private cacheService: CachingService,
    private dataService: DataService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  search(
    startDate: Date,
    endDate: Date,
    term: string
  ): Observable<ApodModel[]> {
    if (!term || term.length < minSymbolsToTriggerSearch) {
      let defaultCache = this.cacheService.get(
        PAGE_KEYS.APOD,
        DEFAULT_CACHE_KEYS.APOD
      ) as ApodModel[];

      if (defaultCache) {
        return of(defaultCache);
      } else {
        return this.apiCall(startDate, endDate);
      }
    }

    let cache = this.cacheService.get(PAGE_KEYS.APOD, term) as ApodModel[];

    if (cache) {
      return of(cache);
    }

    let defaultCache = this.cacheService.get(
      PAGE_KEYS.APOD,
      DEFAULT_CACHE_KEYS.APOD
    );

    if (!defaultCache) {
      return of([]);
    }

    const { property, value } = parseSearchTerm(term);

    switch (property?.toLowerCase()) {
      // filter by title
      case 't':
        let t_filteredData = defaultCache.filter((item: ApodModel) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.set(PAGE_KEYS.APOD, term, t_filteredData);
        return of(t_filteredData);
      // filter by explanation
      case 'e':
        let e_filteredData = defaultCache.filter((item: ApodModel) =>
          item.explanation.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.set(PAGE_KEYS.APOD, term, e_filteredData);
        return of(e_filteredData);
      // filter by copyright
      case 'c':
        let c_filteredData = defaultCache.filter((item: ApodModel) =>
          item.copyright.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.set(PAGE_KEYS.APOD, term, c_filteredData);
        return of(c_filteredData);
      // filter by date
      case 'd':
        let d_filteredData = defaultCache.filter((item: ApodModel) =>
          item.date.includes(value)
        );
        this.cacheService.set(PAGE_KEYS.APOD, term, d_filteredData);
        return of(d_filteredData);
      default:
        return of([]);
    }
  }

  private apiCall(startDate: Date, endDate: Date): Observable<ApodModel[]> {
    let modifiedStartDate = subtractDayFromDate(startDate);
    let modifiedEndDate = subtractDayFromDate(endDate);

    return this.dataService.getApods(modifiedStartDate, modifiedEndDate).pipe(
      map((responseData) => {
        if (responseData.length == 0) {
          return [];
        }

        this.cacheService.set(
          PAGE_KEYS.APOD,
          DEFAULT_CACHE_KEYS.APOD,
          responseData
        );

        return responseData;
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);
        this.router.navigate([ROUTES.error], {
          state: { returnUrl: ROUTES.apod },
        });

        return [];
      })
    );
  }
}
