import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MarsCuriosityActions } from './mars-photos-curiosity.actions';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { MarsCuriositySearchService } from '../search/mars-curiosity-search.service';
import { Store } from '@ngrx/store';
import {
  selectMarsCuriosityCurrentSol,
  selectMarsCuriositySearchQuery,
} from './mars-photos-curiosity.selectors';

@Injectable()
export class MarsCuriosityEffects {
  constructor(
    private actions$: Actions,
    private searchService: MarsCuriositySearchService,
    private readonly store: Store
  ) {}

  loadManifest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarsCuriosityActions.loadManifest),
      switchMap(() =>
        this.searchService.getManifest().pipe(
          map((data) => {
            this.store.dispatch(
              MarsCuriosityActions.loadManifestSuccess({
                data,
              })
            );
          }),
          catchError((error) =>
            of(MarsCuriosityActions.loadManifestFailure({ error }))
          )
        )
      ),
      concatMap(() => of(MarsCuriosityActions.loadData()))
    )
  );

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarsCuriosityActions.loadData, MarsCuriosityActions.setSol),
      switchMap(() =>
        this.store.select(selectMarsCuriosityCurrentSol).pipe(
          switchMap((currentSol) =>
            this.searchService.load(currentSol).pipe(
              map((data) => {
                return MarsCuriosityActions.loadDataSuccess({ data });
              }),
              catchError((error) =>
                of(MarsCuriosityActions.loadDataFailure({ error }))
              )
            )
          )
        )
      )
    )
  );

  initiateSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarsCuriosityActions.initiateSearch),
      withLatestFrom(
        this.store.select(selectMarsCuriositySearchQuery),
        this.store.select(selectMarsCuriosityCurrentSol)
      ),
      mergeMap(([, searchQuery, currentSol]) =>
        this.searchService.search(currentSol, searchQuery).pipe(
          map((data) => MarsCuriosityActions.initiateSearchSuccess({ data })),
          catchError((error) =>
            of(MarsCuriosityActions.initiateSearchFailure({ error }))
          )
        )
      )
    )
  );
}
