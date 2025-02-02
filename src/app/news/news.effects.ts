import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { NewsActions } from './news.actions';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { NewsSearchService } from '../search/news-search.service';
import { of } from 'rxjs';
import { CachingNewsService } from '../cache/news/caching-news.service';
import { Store } from '@ngrx/store';
import {
  selectNewsItemsPerPage,
  selectNewsPage,
  selectNewsSearchItemsPerPage,
  selectNewsSearchPage,
  selectNewsSearchQuery,
} from './news.selectors';

@Injectable()
export class NewsEffects {
  constructor(
    private actions$: Actions,
    private searchService: NewsSearchService,
    private cachingService: CachingNewsService,
    private readonly store: Store
  ) {}

  loadNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadData),
      withLatestFrom(
        this.store.select(selectNewsPage),
        this.store.select(selectNewsItemsPerPage)
      ),
      mergeMap(([, currentPage, itemsPerPage]) =>
        this.searchService.load(currentPage, itemsPerPage).pipe(
          map((data) => NewsActions.loadDataSuccess({ data })),
          catchError((error) => of(NewsActions.loadDataFailure({ error })))
        )
      )
    )
  );

  initiateSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.initiateSearch),
      withLatestFrom(
        this.store.select(selectNewsSearchQuery),
        this.store.select(selectNewsSearchPage),
        this.store.select(selectNewsSearchItemsPerPage)
      ),
      mergeMap(([, searchQuery, currentPage, itemsPerPage]) =>
        this.searchService
          .search(searchQuery, searchQuery, currentPage, itemsPerPage)
          .pipe(
            map((data) => NewsActions.initiateSearchSuccess({ data })),
            catchError((error) =>
              of(NewsActions.initiateSearchFailure({ error }))
            )
          )
      )
    )
  );

  changeItemsPerPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.setItemsPerPage),
      tap(() => this.cachingService.clearPagination()),
      switchMap((action) =>
        this.store.select(selectNewsPage).pipe(
          take(1),
          switchMap((currentPage) => {
            return this.searchService
              .load(currentPage, action.itemsPerPage)
              .pipe(
                map((data) => NewsActions.loadDataSuccess({ data })),
                catchError((error) =>
                  of(NewsActions.loadDataFailure({ error }))
                )
              );
          })
        )
      )
    )
  );

  changeSearchItemsPerPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.setSearchItemsPerPage),
      tap(() => this.cachingService.clearSearch()),
      withLatestFrom(
        this.store.select(selectNewsSearchQuery),
        this.store.select(selectNewsSearchPage)
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
            map((data) => NewsActions.initiateSearchSuccess({ data })),
            catchError((error) =>
              of(NewsActions.initiateSearchFailure({ error }))
            )
          )
      )
    )
  );

  setPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.setPage),
      withLatestFrom(this.store.select(selectNewsItemsPerPage)),
      mergeMap(([action, itemsPerPage]) =>
        this.searchService.load(action.currentPage, itemsPerPage).pipe(
          map((data) => NewsActions.loadDataSuccess({ data })),
          catchError((error) => of(NewsActions.loadDataFailure({ error })))
        )
      )
    )
  );

  setSearchPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.setSearchPage),
      withLatestFrom(
        this.store.select(selectNewsSearchQuery),
        this.store.select(selectNewsSearchItemsPerPage)
      ),
      mergeMap(([action, searchQuery, itemsPerPage]) =>
        this.searchService
          .search(searchQuery, searchQuery, action.searchPage, itemsPerPage)
          .pipe(
            map((data) => NewsActions.initiateSearchSuccess({ data })),
            catchError((error) =>
              of(NewsActions.initiateSearchFailure({ error }))
            )
          )
      )
    )
  );
}
