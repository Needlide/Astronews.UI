import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { NewsActions } from './news.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { NewsSearchService } from '../search/news-search.service';
import { of } from 'rxjs';

@Injectable()
export class NewsEffects {
  constructor(
    private actions$: Actions,
    private searchService: NewsSearchService
  ) {}

  loadNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadData),
      mergeMap((action) =>
        this.searchService.search(action.searchTerm).pipe(
          map((data) => NewsActions.loadDataSuccess({ data })),
          catchError((error) => of(NewsActions.loadDataFailure({ error })))
        )
      )
    )
  );
}
