import { Injectable } from '@angular/core';
import { CachingApodService } from '../cache/apod/caching-apod.service';
import { ApodModel } from '../models/apod/apod.model';
import { parseSearchTerm } from './search.util';
import {
  errorMessageCacheRetrieve,
  errorMessageDataFetch,
  firstDateForApod,
} from '../shared/constants';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { DataService } from '../data.service';
import { isISO8601Date } from '../shared/date-functions';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { ROUTES } from '../app.routes';
import { Store } from '@ngrx/store';
import { selectApodData } from '../apod/apod.selectors';
import { DatePipe } from '@angular/common';
import { Either, left, right, isLeft } from 'fp-ts/lib/Either';
import { ApodActions } from '../apod/apod.actions';

@Injectable({
  providedIn: 'root',
})
export class ApodSearchService {
  constructor(
    private cacheService: CachingApodService,
    private dataService: DataService,
    private errorService: ErrorService,
    private router: Router,
    private store: Store,
    private datePipe: DatePipe
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

        return this.searchLogic(searchTerm, data, cacheKey, pageNumber).pipe(
          map((result) => {
            if (isLeft(result)) {
              const errorMessage = result.left;
              this.store.dispatch(
                ApodActions.setError({ error: errorMessage })
              );
              return [];
            } else {
              const apodModels = result.right;

              return apodModels;
            }
          })
        );
      })
    );
  }

  loadPageFromCache(pageNumber: number): Observable<ApodModel[]> {
    let cache = this.cacheService.getPagination(pageNumber);

    if (!cache) {
      this.store.dispatch(
        ApodActions.setError({ error: errorMessageCacheRetrieve })
      );
      return of([]);
    }

    return of(cache);
  }

  private searchLogic(
    searchTerm: string,
    data: ApodModel[],
    cacheKey: string,
    pageNumber: number
  ): Observable<Either<string, ApodModel[]>> {
    // property - prefix    value - search value
    // if search term doesn't contain the prefix - the property is undefined
    const { property, value } = parseSearchTerm(searchTerm);

    if (!property) {
      let filteredData = data.filter(
        (item: ApodModel) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.explanation.toLowerCase().includes(value.toLowerCase()) ||
          item.copyright?.toLowerCase().includes(value.toLowerCase()) ||
          item.date.includes(value)
      );

      this.cacheService.setSearch(pageNumber, cacheKey, filteredData);

      return of(right(filteredData));
    }

    switch (property?.toLowerCase()) {
      // filter by title
      case 't':
        let t_filteredData = data.filter((item: ApodModel) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.setSearch(pageNumber, cacheKey, t_filteredData);
        return of(right(t_filteredData));
      // filter by explanation
      case 'e':
        let e_filteredData = data.filter((item: ApodModel) =>
          item.explanation.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.setSearch(pageNumber, cacheKey, e_filteredData);
        return of(right(e_filteredData));
      // filter by copyright
      case 'c':
        let c_filteredData = data.filter((item: ApodModel) =>
          item.copyright.toLowerCase().includes(value.toLowerCase())
        );
        this.cacheService.setSearch(pageNumber, cacheKey, c_filteredData);
        return of(right(c_filteredData));
      // request single image from API by date
      case 'd':
        if (!isISO8601Date(value)) {
          return of(
            left(
              'Invalid date format. Please use YYYY-MM-DD format (e.g. 2020-10-30).'
            )
          );
        }

        const date = new Date(value);
        if (date < firstDateForApod || date > new Date()) {
          return of(
            left(
              `Date must be between June 16, 1995, and ${this.datePipe.transform(
                new Date(),
                'MMMM d, y'
              )}.`
            )
          );
        }

        return this.dataService.getApod(date).pipe(
          map((apod) => right([apod])),
          catchError(() => of(left('Failed to fetch APOD data.')))
        );

      // filter by date
      case 'dd':
        let d_filteredData = data.filter((item: ApodModel) =>
          item.date.includes(value)
        );
        this.cacheService.setSearch(pageNumber, cacheKey, d_filteredData);
        return of(right(d_filteredData));
      default:
        return of(
          left(
            `Invalid search prefix: '${property}'. Valid prefixes are \`t\` - title, \`e\` - explanation, \`c\` - copyright, \`d\` - date.`
          )
        );
    }
  }

  private apiCall(
    startDate: Date,
    endDate: Date,
    pageNumber: number
  ): Observable<ApodModel[]> {
    return this.dataService.getApods(startDate, endDate).pipe(
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
}
