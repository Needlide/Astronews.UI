import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MarsCuriosityActions } from './mars-photos-curiosity.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { MarsCuriositySearchService } from '../search/mars-curiosity-search.service';

@Injectable()
export class MarsCuriosityEffects {
  constructor(
    private actions$: Actions,
    private searchService: MarsCuriositySearchService
  ) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarsCuriosityActions.loadData),
      switchMap((action) =>
        this.searchService.search(action.searchTerm).pipe(
          map((data) => MarsCuriosityActions.loadDataSuccess({ data })),
          catchError((error) =>
            of(MarsCuriosityActions.loadDataFailure({ error }))
          )
        )
      )
    )
  );
}
