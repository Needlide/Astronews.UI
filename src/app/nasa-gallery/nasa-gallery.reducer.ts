import { createReducer, on } from '@ngrx/store';
import { GalleryModel } from '../models/gallery/gallery.model';
import { NasaGalleryActions } from './nasa-gallery.actions';

export interface NasaGalleryState {
  data: GalleryModel[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: NasaGalleryState = {
  data: [],
  isLoading: false,
  error: null,
};

export const nasaGalleryReducer = createReducer(
  initialState,
  on(NasaGalleryActions.loadData, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(NasaGalleryActions.loadDataSuccess, (state, { data }) => ({
    ...state,
    data: [...state.data, ...data],
    isLoading: false,
    error: null,
  })),
  on(NasaGalleryActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
