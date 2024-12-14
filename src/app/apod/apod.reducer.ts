import { createReducer, on } from '@ngrx/store';
import { ApodModel } from '../models/apod/apod.model';
import { ApodActions } from './apod.actions';
import { ApodPayload } from '../models/cache/apod-cache.model';

export interface ApodState {
  data: ApodModel[];
  paginationValues: ApodPayload[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: ApodState = {
  data: [],
  paginationValues: [],
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
  on(ApodActions.loadDataSuccess, (state, { data, paginationValues }) => ({
    ...state,
    data: [...state.data, ...data],
    paginationValues: [...state.paginationValues, ...paginationValues],
    isLoading: false,
    error: null,
  })),
  on(ApodActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
