import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { DataService } from '../data.service';
import { loadNews, loadNewsSuccess, loadNewsFailure } from './news.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class NewsEffects {
  constructor(private actions$: Actions, private dataService: DataService) {}

  loadNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadNews),
      mergeMap((action) =>
        this.dataService.getNews(action.url).pipe(
          map((response) => loadNewsSuccess({
            data: response.results,
            nextUrl: response.next,
          })),
          catchError((error) => of(loadNewsFailure({ error: error.message })))
        )
      )
    )
  );
}

