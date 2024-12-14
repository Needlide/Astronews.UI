import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NasaGalleryState } from './nasa-gallery.reducer';

export const selectNasaGalleryState =
  createFeatureSelector<NasaGalleryState>('nasa-gallery');

export const selectNasaGalleryData = createSelector(
  selectNasaGalleryState,
  (state) => state.data
);

export const selectNasaGalleryIsLoading = createSelector(
  selectNasaGalleryState,
  (state) => state.isLoading
);

export const selectNasaGalleryError = createSelector(
  selectNasaGalleryState,
  (state) => state.error
);
