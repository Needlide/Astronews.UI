import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../data.service';
import { CachingService } from '../cache/caching.service';
import { ApodActions } from './apod.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { ApodCache } from '../models/cache/apod-cache.model';
import {
  subtractDayFromDate,
  subtractMonthFromDate,
} from '../shared/date-functions';

@Injectable()
export class ApodEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private cacheService: CachingService
  ) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApodActions.loadData),
      switchMap((action) => {
        const cache = this.cacheService.get(
          PAGE_KEYS.APOD,
          DEFAULT_CACHE_KEYS.APOD
        ) as ApodCache;

        if (cache) {
          return of(
            ApodActions.loadDataSuccess({
              data: cache.data,
              paginationValues: cache.paginationValues,
            })
          );
        } else {
          return this.dataService
            .getApods(action.startDate, action.endDate)
            .pipe(
              tap((response) => {
                // subtract a month so the API returns data for a whole month
                // subtract a day to not overlap the existing data with new from API
                // (example: API returned data for 15.11 - 15.12 (dd-MM),
                // and to not overlap data with 15.10 - 15.11 we subtract a day,
                // so we get results for 14.10 - 14.11, without duplicating 15.11)

                let previousStartDate = subtractDayFromDate(
                  subtractMonthFromDate(action.startDate)
                );

                let previousEndDate = subtractDayFromDate(
                  subtractMonthFromDate(action.endDate)
                );

                const apodCache: ApodCache = {
                  data: response,
                  paginationValues: [
                    { startDate: previousStartDate, endDate: previousEndDate },
                  ],
                };

                this.cacheService.set(
                  PAGE_KEYS.APOD,
                  DEFAULT_CACHE_KEYS.APOD,
                  apodCache
                );
              }),
              map((response) =>
                ApodActions.loadDataSuccess({
                  data: response,
                  paginationValues: [],
                })
              ),
              catchError((error) =>
                of(ApodActions.loadDataFailure({ error: error.message }))
              )
            );
        }
      })
    )
  );
}
