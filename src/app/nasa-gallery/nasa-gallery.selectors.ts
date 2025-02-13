import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NasaGalleryState } from './nasa-gallery.reducer';

export const selectNasaGalleryState =
  createFeatureSelector<NasaGalleryState>('nasaGallery');

// Selectors for pagination
export const selectNasaGalleryPage = createSelector(
  selectNasaGalleryState,
  (state) => state.page
);

export const selectNasaGalleryTotalItems = createSelector(
  selectNasaGalleryState,
  (state) => state.totalItems
);

export const selectNasaGalleryItemsPerPage = createSelector(
  selectNasaGalleryState,
  (state) => state.itemsPerPage
);

// Selectors for search state
export const selectNasaGallerySearchState = createSelector(
  selectNasaGalleryState,
  (state) => state.searchState
);

export const selectNasaGallerySearchPage = createSelector(
  selectNasaGallerySearchState,
  (searchState) => searchState.page
);

export const selectNasaGalleryTotalSearchItems = createSelector(
  selectNasaGallerySearchState,
  (searchState) => searchState.totalItems
);

export const selectNasaGallerySearchItemsPerPage = createSelector(
  selectNasaGallerySearchState,
  (searchState) => searchState.itemsPerPage
);

export const selectNasaGallerySearchQuery = createSelector(
  selectNasaGallerySearchState,
  (searchState) => searchState.searchQuery
);

// General selectors
export const selectNasaGalleryData = createSelector(
  selectNasaGalleryState,
  (state) => state.data
);

export const selectNasaGalleryLoading = createSelector(
  selectNasaGalleryState,
  (state) => state.isLoading
);

export const selectNasaGalleryError = createSelector(
  selectNasaGalleryState,
  (state) => state.error
);

export const selectNasaGalleryIsSearchState = createSelector(
  selectNasaGalleryState,
  (state) => state.isSearchState
);
