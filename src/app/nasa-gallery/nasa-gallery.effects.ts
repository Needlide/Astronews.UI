import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NasaGalleryActions } from './nasa-gallery.actions';
import {
  catchError,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { GallerySearchService } from '../search/gallery-search.service';
import { Store } from '@ngrx/store';
import {
  selectNasaGalleryItemsPerPage,
  selectNasaGalleryPage,
  selectNasaGallerySearchItemsPerPage,
  selectNasaGallerySearchPage,
  selectNasaGallerySearchQuery,
} from './nasa-gallery.selectors';
import { CachingGalleryService } from '../cache/nasa-gallery/caching-gallery.service';

@Injectable()
export class NasaGalleryEffects {
  constructor(
    private actions$: Actions,
    private searchService: GallerySearchService,
    private cachingService: CachingGalleryService,
    private readonly store: Store
  ) {}

  loadGallery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NasaGalleryActions.loadData),
      withLatestFrom(
        this.store.select(selectNasaGalleryPage),
        this.store.select(selectNasaGalleryItemsPerPage)
      ),
      mergeMap(([, currentPage, itemsPerPage]) =>
        this.searchService.load(currentPage, itemsPerPage).pipe(
          tap((data) =>
            this.store.dispatch(
              NasaGalleryActions.setTotalItems({ totalItems: data.totalItems })
            )
          ),
          map((data) =>
            NasaGalleryActions.loadDataSuccess({ data: data.data })
          ),
          catchError((error) =>
            of(NasaGalleryActions.loadDataFailure({ error }))
          )
        )
      )
    )
  );

  initiateSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NasaGalleryActions.initiateSearch),
      withLatestFrom(
        this.store.select(selectNasaGallerySearchQuery),
        this.store.select(selectNasaGalleryItemsPerPage),
        this.store.select(selectNasaGalleryPage)
      ),
      mergeMap(([, searchQuery, itemsPerPage, currentPage]) =>
        this.searchService
          .search(searchQuery, searchQuery, currentPage, itemsPerPage)
          .pipe(
            tap((data) => {
              this.store.dispatch(
                NasaGalleryActions.setTotalSearchItems({
                  totalSearchItems: data.totalItems,
                })
              );
            }),
            map((data) =>
              NasaGalleryActions.initiateSearchSuccess({ data: data.data })
            ),
            catchError((error) =>
              of(NasaGalleryActions.initiateSearchFailure({ error }))
            )
          )
      )
    )
  );

  changeItemsPerPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NasaGalleryActions.setItemsPerPage),
      tap(() => this.cachingService.clearPagination()),
      switchMap((action) =>
        this.store.select(selectNasaGalleryPage).pipe(
          take(1),
          switchMap((currentPage) => {
            return this.searchService
              .load(currentPage, action.itemsPerPage)
              .pipe(
                tap((data) =>
                  this.store.dispatch(
                    NasaGalleryActions.setTotalItems({
                      totalItems: data.totalItems,
                    })
                  )
                ),
                map((data) =>
                  NasaGalleryActions.loadDataSuccess({ data: data.data })
                ),
                catchError((error) =>
                  of(NasaGalleryActions.loadDataFailure({ error }))
                )
              );
          })
        )
      )
    )
  );

  changeSearchItemsPerPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NasaGalleryActions.setSearchItemsPerPage),
      tap(() => this.cachingService.clearSearch()),
      withLatestFrom(
        this.store.select(selectNasaGallerySearchQuery),
        this.store.select(selectNasaGallerySearchPage)
      ),
      mergeMap(([action, searchQuery, currentPage]) =>
        this.searchService
          .search(
            searchQuery,
            searchQuery,
            currentPage,
            action.searchItemsPerPage
          )
          .pipe(
            tap((data) =>
              NasaGalleryActions.setTotalSearchItems({
                totalSearchItems: data.totalItems,
              })
            ),
            map((data) =>
              NasaGalleryActions.initiateSearchSuccess({ data: data.data })
            ),
            catchError((error) =>
              of(NasaGalleryActions.initiateSearchFailure({ error }))
            )
          )
      )
    )
  );

  setPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NasaGalleryActions.setPage),
      switchMap((action) =>
        this.store.select(selectNasaGalleryItemsPerPage).pipe(
          take(1),
          switchMap((itemsPerPage) =>
            this.searchService.load(action.currentPage, itemsPerPage).pipe(
              tap((data) =>
                this.store.dispatch(
                  NasaGalleryActions.setTotalItems({
                    totalItems: data.totalItems,
                  })
                )
              ),
              map((data) =>
                NasaGalleryActions.loadDataSuccess({ data: data.data })
              ),
              catchError((error) =>
                of(NasaGalleryActions.loadDataFailure({ error }))
              )
            )
          )
        )
      )
    )
  );

  setSearchPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NasaGalleryActions.setSearchPage),
      withLatestFrom(
        this.store.select(selectNasaGallerySearchQuery),
        this.store.select(selectNasaGallerySearchItemsPerPage)
      ),
      mergeMap(([action, searchQuery, itemsPerPage]) =>
        this.searchService
          .search(searchQuery, searchQuery, action.searchPage, itemsPerPage)
          .pipe(
            tap((data) =>
              NasaGalleryActions.setTotalSearchItems({
                totalSearchItems: data.totalItems,
              })
            ),
            map((data) =>
              NasaGalleryActions.initiateSearchSuccess({ data: data.data })
            ),
            catchError((error) =>
              of(NasaGalleryActions.initiateSearchFailure({ error }))
            )
          )
      )
    )
  );
}
