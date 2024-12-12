import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../data.service';
import { CachingService } from '../cache/caching.service';
import { ApodActions } from './apod.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { ApodCache } from '../models/cache/apod-cache.model';

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
                let previousDates = this.getPreviousDate(
                  action.startDate,
                  action.endDate
                );

                let nextDates = this.getNextDate(
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

  // subtract a month so the API returns data for a whole month
  // subtract a day to not overlap the existing data with new from API
  // (API returned data for 15.11 - 15.12,
  // and to not overlap data with 15.10 - 15.11 we subtract a day)
  getPreviousDate(startDate: Date, endDate: Date) {
    let startDateLocal = new Date(startDate);
    startDateLocal.setDate(startDateLocal.getDate() - 1);
    startDateLocal.setMonth(startDateLocal.getMonth() - 1);

    let endDateLocal = new Date(endDate);
    endDateLocal.setDate(endDateLocal.getDate() - 1);
    endDateLocal.setMonth(endDateLocal.getMonth() - 1);

    return { startDate: startDateLocal, endDate: endDateLocal };
  }

  getNextDate(startDate: Date, endDate: Date) {
    let startDateLocal = new Date(startDate);
    startDateLocal.setDate(startDateLocal.getDate() + 1);
    startDateLocal.setMonth(startDateLocal.getMonth() + 1);

    let endDateLocal = new Date(endDate);
    endDateLocal.setDate(endDateLocal.getDate() + 1);
    endDateLocal.setMonth(endDateLocal.getMonth() + 1);

    return { startDate: startDateLocal, endDate: endDateLocal };
  }
}
