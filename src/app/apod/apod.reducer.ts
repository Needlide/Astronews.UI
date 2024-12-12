import { createReducer, on } from '@ngrx/store';
import { ApodModel } from '../models/apod/apod.model';
import { ApodActions } from './apod.actions';

export interface ApodState {
  data: ApodModel[];
  nextUrl: string;
  prevUrl: string;
  isLoading: boolean;
  error: string | null;
}

export const initialState: ApodState = {
  data: [],
  nextUrl: '',
  prevUrl: '',
  isLoading: false,
  error: null,
};

export const apodReducer = createReducer(
  initialState,
  on(ApodActions.loadData, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(ApodActions.loadDataSuccess, (state, { data, nextUrl, prevUrl }) => ({
    ...state,
    data: [...state.data, ...data],
    nextUrl,
    prevUrl,
    isLoading: false,
    error: null,
  })),
  on(ApodActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
