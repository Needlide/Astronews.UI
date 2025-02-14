import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MarsCuriosityState } from './mars-photos-curiosity.reducer';

export const selectMarsCuriosityState =
  createFeatureSelector<MarsCuriosityState>('marsCuriosity');

export const selectMarsCuriosityData = createSelector(
  selectMarsCuriosityState,
  (state) => state.data
);

export const selectMarsCuriosityIsLoading = createSelector(
  selectMarsCuriosityState,
  (state) => state.isLoading
);

export const selectMarsCuriosityError = createSelector(
  selectMarsCuriosityState,
  (state) => state.error
);

export const selectMarsCuriosityMaxSol = createSelector(
  selectMarsCuriosityState,
  (state) => state.maxSol
);

export const selectMarsCuriosityMaxDate = createSelector(
  selectMarsCuriosityState,
  (state) => state.maxDate
);

export const selectMarsCuriosityTotalItems = createSelector(
  selectMarsCuriosityState,
  (state) => state.totalItems
);

export const selectMarsCuriositySearchQuery = createSelector(
  selectMarsCuriosityState,
  (state) => state.searchQuery
);

export const selectMarsCuriosityCurrentSol = createSelector(
  selectMarsCuriosityState,
  (state) => state.currentSol
);

export const selectMarsCuriosityPaginationEnabled = createSelector(
  selectMarsCuriosityState,
  (state) => state.paginationEnabled
);
