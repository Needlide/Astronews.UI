import { createReducer, on } from '@ngrx/store';
import { NasaGalleryActions } from './nasa-gallery.actions';
import { Data } from '../models/gallery/gallery.root.model';

export interface NasaGalleryState {
  data: Data[];
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
    data: data,
    isLoading: false,
    error: null,
  })),
  on(NasaGalleryActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
