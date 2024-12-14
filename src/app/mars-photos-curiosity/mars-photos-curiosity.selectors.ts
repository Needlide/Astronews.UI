import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MarsCuriosityState } from './mars-photos-curiosity.reducer';

export const selectMarsCuriosityState =
  createFeatureSelector<MarsCuriosityState>('mars-curiosity');

export const selectMarsCuriosityData = createSelector(
  selectMarsCuriosityState,
  (state) => state.data
);

export const selectMarsCuriosityMaxSol = createSelector(
  selectMarsCuriosityState,
  (state) => state.maxSol
);

export const selectMarsCuriosityIsLoading = createSelector(
  selectMarsCuriosityState,
  (state) => state.isLoading
);

export const selectMarsCuriosityError = createSelector(
  selectMarsCuriosityState,
  (state) => state.error
);
