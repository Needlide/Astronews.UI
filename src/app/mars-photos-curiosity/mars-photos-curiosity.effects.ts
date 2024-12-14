import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../data.service';
import { CachingService } from '../cache/caching.service';
import { MarsCuriosityActions } from './mars-photos-curiosity.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { MarsCuriosityCache } from '../models/cache/mars-curiosity.model';
import { Injectable } from '@angular/core';

@Injectable()
export class MarsCuriosityEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private cacheService: CachingService
  ) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarsCuriosityActions.loadData),
      switchMap((action) => {
        const cache = this.cacheService.get(
          PAGE_KEYS.MARS_CURIOSITY,
          DEFAULT_CACHE_KEYS.MARS_CURIOSITY
        ) as MarsCuriosityCache;

        if (cache) {
          return of(
            MarsCuriosityActions.loadDataSuccess({
              data: cache.data,
              maxSol: cache.maxSol,
            })
          );
        } else {
          return this.dataService.getMarsLatestPhotos(action.url).pipe(
            tap((response) => {
              const maxSol = response.latest_photos[0]?.rover?.max_sol ?? 0;

              const curiosityCache: MarsCuriosityCache = {
                data: response.latest_photos,
                maxSol: maxSol,
              };

              this.cacheService.set(
                PAGE_KEYS.MARS_CURIOSITY,
                DEFAULT_CACHE_KEYS.MARS_CURIOSITY,
                curiosityCache
              );
            }),
            map((response) => {
              const maxSol = response.latest_photos[0]?.rover?.max_sol ?? 0;
              return MarsCuriosityActions.loadDataSuccess({
                data: response.latest_photos,
                maxSol: maxSol,
              });
            }),
            catchError((error) =>
              of(MarsCuriosityActions.loadDataFailure({ error: error.message }))
            )
          );
        }
      })
    )
  );
}
