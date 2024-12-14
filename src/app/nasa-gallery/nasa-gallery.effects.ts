import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../data.service';
import { CachingService } from '../cache/caching.service';
import { NasaGalleryActions } from './nasa-gallery.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { GalleryCache } from '../models/cache/gallery-cache.model';

@Injectable()
export class NasaGalleryEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private cacheService: CachingService
  ) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NasaGalleryActions.loadData),
      switchMap((action) => {
        const cache = this.cacheService.get(
          PAGE_KEYS.NASA_GALLERY,
          DEFAULT_CACHE_KEYS.NASA_GALLERY
        ) as GalleryCache;

        if (cache) {
          return of(NasaGalleryActions.loadDataSuccess({ data: cache.data }));
        } else {
          return this.dataService.getNasaGallery(action.url).pipe(
            tap((response) => {
              const galleryCache: GalleryCache = {
                data: response.collection.items[0].data,
              };

              this.cacheService.set(
                PAGE_KEYS.NASA_GALLERY,
                DEFAULT_CACHE_KEYS.NASA_GALLERY,
                galleryCache
              );
            }),
            map((response) =>
              NasaGalleryActions.loadDataSuccess({
                data: response.collection.items[0].data,
              })
            ),
            catchError((error) =>
              of(NasaGalleryActions.loadDataFailure({ error: error.message }))
            )
          );
        }
      })
    )
  );
}
