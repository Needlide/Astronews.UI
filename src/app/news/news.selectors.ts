import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NewsState } from './news.reducer';

export const selectNewsState = createFeatureSelector<NewsState>('news');

// Selectors for pagination
export const selectNewsPage = createSelector(
  selectNewsState,
  (state) => state.page
);

export const selectNewsTotalItems = createSelector(
  selectNewsState,
  (state) => state.totalItems
);

export const selectNewsItemsPerPage = createSelector(
  selectNewsState,
  (state) => state.itemsPerPage
);

// Selectors for search state
export const selectNewsSearchState = createSelector(
  selectNewsState,
  (state) => state.searchState
);

export const selectNewsSearchPage = createSelector(
  selectNewsSearchState,
  (searchState) => searchState.page
);

export const selectNewsTotalSearchItems = createSelector(
  selectNewsSearchState,
  (searchState) => searchState.totalItems
);

export const selectNewsSearchItemsPerPage = createSelector(
  selectNewsSearchState,
  (searchState) => searchState.itemsPerPage
);

export const selectNewsSearchQuery = createSelector(
  selectNewsSearchState,
  (searchState) => searchState.searchQuery
);

// General selectors

export const selectNewsData = createSelector(
  selectNewsState,
  (state) => state.data
);

export const selectNewsLoading = createSelector(
  selectNewsState,
  (state) => state.isLoading
);

export const selectNewsError = createSelector(
  selectNewsState,
  (state) => state.error
);

export const selectNewsIsSearchState = createSelector(
  selectNewsState,
  (state) => state.isSearchState
);
