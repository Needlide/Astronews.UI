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
