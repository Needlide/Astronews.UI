import { createSelector } from '@ngrx/store';
import { searchFeature } from './search.state';

export const selectSearchTerm = createSelector(
  searchFeature.selectSearchState,
  (state) => state.term
);

export const selectSearchResults = createSelector(
  searchFeature.selectSearchState,
  (state) => state.results
);
