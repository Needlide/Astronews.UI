import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApodState } from './apod.reducer';

export const selectApodState = createFeatureSelector<ApodState>('apod');

export const selectApodData = createSelector(
  selectApodState,
  (state) => state.data
);

export const selectApodLoading = createSelector(
  selectApodState,
  (state) => state.isLoading
);

export const selectApodError = createSelector(
  selectApodState,
  (state) => state.error
);

export const selectApodPage = createSelector(
  selectApodState,
  (state) => state.page
);

export const selectApodTotalItems = createSelector(
  selectApodState,
  (state) => state.totalItems
);
