import { createReducer, on } from '@ngrx/store';
import { ApodModel } from '../models/apod/apod.model';
import { ApodActions } from './apod.actions';

export interface ApodState {
  data: ApodModel[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: ApodState = {
  data: [],
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
  on(ApodActions.loadDataSuccess, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    error: null,
  })),
  on(ApodActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
