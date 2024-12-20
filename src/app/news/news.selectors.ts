import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NewsState } from './news.reducer';

export const selectNewsState = createFeatureSelector<NewsState>('news');

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
