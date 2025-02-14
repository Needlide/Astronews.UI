import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApodActions } from './apod.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { ApodSearchService } from '../search/apod-search.service';
import { subtractDayFromDate } from '../shared/date-functions';

@Injectable()
export class ApodEffects {
  constructor(
    private actions$: Actions,
    private searchService: ApodSearchService
  ) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApodActions.loadData),
      switchMap((action) =>
        this.searchService
          .load(action.startDate, action.endDate, action.pageNumber)
          .pipe(
            map((data) => {
              return ApodActions.loadDataSuccess({ data });
            }),
            catchError((error) => of(ApodActions.loadDataFailure({ error })))
          )
      )
    )
  );

  initiateSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApodActions.initiateSearch),
      switchMap((action) =>
        this.searchService
          .search(action.searchTerm, action.cacheKey, action.pageNumber)
          .pipe(
            map((data) => {
              return ApodActions.initiateSearchSuccess({ data });
            }),
            catchError((error) =>
              of(ApodActions.initiateSearchFailure({ error }))
            )
          )
      )
    )
  );

  loadPageFromCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApodActions.loadPageFromCache),
      switchMap((action) =>
        this.searchService.loadPageFromCache(action.pageNumber).pipe(
          map((data) => {
            return ApodActions.loadPageFromCacheSuccess({ data });
          }),
          catchError((error) =>
            of(ApodActions.loadPageFromCacheFailure({ error }))
          )
        )
      )
    )
  );

  calculateTotalItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApodActions.calculateTotalItems),
      map(() => {
        const currentDate = subtractDayFromDate(new Date());
        const firstDateForApod = new Date('Jun 16, 1995');
        const timeDifference =
          currentDate.getTime() - firstDateForApod.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        return ApodActions.calculateTotalItemsSuccess({
          totalItems: Math.floor(daysDifference),
        });
      })
    )
  );
}
