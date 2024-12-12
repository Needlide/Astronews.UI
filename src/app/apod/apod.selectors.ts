import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApodState } from './apod.reducer';

export const selectApodState = createFeatureSelector<ApodState>('apod');

export const selectApodData = createSelector(
  selectApodState,
  (state) => state.data
);

export const selectApodPaginationUrls = createSelector(
  selectApodState,
  (state) => ({
    nextUrl: state.nextUrl,
    prevUrl: state.prevUrl,
  })
);

export const selectApodNextUrl = createSelector(
  selectApodState,
  (state) => state.nextUrl
);

export const selectApodPrevUrl = createSelector(
  selectApodState,
  (state) => state.prevUrl
);

export const selectApodLoading = createSelector(
  selectApodState,
  (state) => state.isLoading
);

export const selectApodError = createSelector(
  selectApodState,
  (state) => state.error
);
