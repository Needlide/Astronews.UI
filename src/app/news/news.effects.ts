import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { DataService } from '../data.service';
import { NewsActions } from './news.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CachingService } from '../cache/caching.service';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { NewsCache } from '../models/news/news-cache-model';

@Injectable()
export class NewsEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private cacheService: CachingService
  ) {}

  loadNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadData),
      mergeMap((action) =>
        this.dataService.getNews(action.url).pipe(
          tap((response) => {
            const newsCache: NewsCache = {
              nextUrl: response.next,
              prevUrl: response.previous,
              data: response.results,
            };

            this.cacheService.set(
              PAGE_KEYS.NEWS,
              DEFAULT_CACHE_KEYS.NEWS,
              newsCache
            );
          }),
          map((response) =>
            NewsActions.loadDataSuccess({
              data: response.results,
              nextUrl: response.next,
              prevUrl: response.previous,
            })
          ),
          catchError((error) =>
            of(NewsActions.loadDataFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
