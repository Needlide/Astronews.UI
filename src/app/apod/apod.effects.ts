import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../data.service';
import { CachingService } from '../cache/caching.service';
import { ApodActions } from './apod.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { ApodCache } from '../models/cache/apod-cache.model';
import {
  addMonthFromDate,
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
            })
          );
        } else {
          return this.dataService
            .getApods(action.startDate, action.endDate)
            .pipe(
              tap((response) => {
                // subtract a month so the API returns data for a whole month
                // subtract a day to not overlap the existing data with new from API
                // (API returned data for 15.11 - 15.12,
                // and to not overlap data with 15.10 - 15.11 we subtract a day)

                let previousDates = subtractMonthFromDate(
                  action.startDate,
                  action.endDate
                );

                let nextDates = addMonthFromDate(
                  action.startDate,
                  action.endDate
                );

                const apodCache: ApodCache = {
                  data: response,
                  nextStartYear: nextDates.startDate,
                  nextEndYear: nextDates.endDate,
                  prevStartYear: previousDates.startDate,
                  prevEndYear: previousDates.endDate,
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
