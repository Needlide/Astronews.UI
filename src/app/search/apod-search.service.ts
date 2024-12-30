import { Injectable } from '@angular/core';
import { CachingApodService } from '../cache/apod/caching-apod.service';
import { ApodModel } from '../models/apod/apod.model';
import { parseSearchTerm } from './search.util';
import {
  errorMessageCacheRetrieve,
  errorMessageDataFetch,
} from '../shared/constants';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { DataService } from '../data.service';
import { subtractDayFromDate } from '../shared/date-functions';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { ROUTES } from '../app.routes';
import { Store } from '@ngrx/store';
import { selectApodData } from '../apod/apod.selectors';
import { SearchError } from '../error/apod/search.error';
import { CacheError } from '../error/apod/cache.error';

@Injectable({
  providedIn: 'root',
})
export class ApodSearchService {
  constructor(
    private cacheService: CachingApodService,
    private dataService: DataService,
    private errorService: ErrorService,
    private router: Router,
    private store: Store
  ) {}

  load(
    startDate: Date,
    endDate: Date,
    pageNumber: number
  ): Observable<ApodModel[]> {
    let cache = this.cacheService.getPagination(pageNumber);

    if (cache) {
      return of(cache);
    }

    return this.apiCall(startDate, endDate, pageNumber);
  }

  search(
    searchTerm: string,
    cacheKey: string,
    pageNumber: number
  ): Observable<ApodModel[]> {
    let data$ = this.store.select(selectApodData);
    return data$.pipe(
      take(1),
      switchMap((data) => {
        let cache = this.cacheService.getSearch(pageNumber, cacheKey);

        if (cache) {
          return of(cache);
        }

        return this.searchLogic(searchTerm, data, cacheKey, pageNumber);
      })
    );
  }

  loadPageFromCache(pageNumber: number): Observable<ApodModel[]> {
    let cache = this.cacheService.getPagination(pageNumber);

    if (!cache) {
      throw new CacheError(errorMessageCacheRetrieve, pageNumber);
    }

    return of(cache);
  }

  private searchLogic(
    searchTerm: string,
    data: ApodModel[],
    cacheKey: string,
    pageNumber: number
  ): Observable<ApodModel[]> {
    const { property, value } = parseSearchTerm(searchTerm);
    // TODO t:Comet and t:comet result in two cache records, because cache treats them as two different keys
    switch (property?.toLowerCase()) {
      // filter by title
      case 't':
        let t_filteredData = data.filter((item: ApodModel) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.setSearch(pageNumber, cacheKey, t_filteredData);
        return of(t_filteredData);
      // filter by explanation
      case 'e':
        let e_filteredData = data.filter((item: ApodModel) =>
          item.explanation.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.setSearch(pageNumber, cacheKey, e_filteredData);
        return of(e_filteredData);
      // filter by copyright
      case 'c':
        let c_filteredData = data.filter((item: ApodModel) =>
          item.copyright.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.setSearch(pageNumber, cacheKey, c_filteredData);
        return of(c_filteredData);
      // filter by date
      case 'd':
        // TODO add another case for `dd` which will filter by local data, and case `d` will call an API
        let d_filteredData = data.filter((item: ApodModel) =>
          item.date.includes(value)
        );
        this.cacheService.setSearch(pageNumber, cacheKey, d_filteredData);
        return of(d_filteredData);
      default:
        throw new SearchError(
          `Invalid search prefix: '${property}'. Valid prefixes are \`t\` - title, \`e\` - explanation, \`c\` - copyright, \`d\` - date.`,
          property
        );
    }
  }

  //TODO fix memory leak when returning empty array. Check via breakpoint.

  private apiCall(
    startDate: Date,
    endDate: Date,
    pageNumber: number
  ): Observable<ApodModel[]> {
    let modifiedStartDate = subtractDayFromDate(startDate);
    let modifiedEndDate = subtractDayFromDate(endDate);

    return this.dataService.getApods(modifiedStartDate, modifiedEndDate).pipe(
      map((responseData) => {
        if (responseData.length == 0) {
          return [];
        }

        this.cacheService.setPagination(pageNumber, responseData);

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

  //TODO fix search service not handling the ordinary search term like `NASA`, without property
}
