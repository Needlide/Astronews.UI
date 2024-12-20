import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NasaGalleryActions } from './nasa-gallery.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { GallerySearchService } from '../search/gallery-search.service';

@Injectable()
export class NasaGalleryEffects {
  constructor(
    private actions$: Actions,
    private searchService: GallerySearchService
  ) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NasaGalleryActions.loadData),
      mergeMap((action) =>
        this.searchService.search(action.searchTerm).pipe(
          map((data) => NasaGalleryActions.loadDataSuccess({ data })),
          catchError((error) =>
            of(NasaGalleryActions.loadDataFailure({ error }))
          )
        )
      )
    )
  );
}
