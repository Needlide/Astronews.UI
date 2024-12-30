import { createReducer, on } from '@ngrx/store';
import { ApodModel } from '../models/apod/apod.model';
import { ApodActions } from './apod.actions';

export interface ApodState {
  data: ApodModel[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalItems: number;
}

export const initialState: ApodState = {
  data: [],
  isLoading: false,
  error: null,
  page: 1,
  totalItems: 0,
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
  })),
  on(ApodActions.initiateSearch, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(ApodActions.initiateSearchSuccess, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    error: null,
  })),
  on(ApodActions.initiateSearchFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(ApodActions.loadPageFromCache, (state, { pageNumber }) => ({
    ...state,
    isLoading: true,
    error: null,
    page: pageNumber,
  })),
  on(ApodActions.loadPageFromCacheSuccess, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    error: null,
  })),
  on(ApodActions.loadPageFromCacheFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(ApodActions.calculateTotalItemsSuccess, (state, { totalItems }) => ({
    ...state,
    totalItems,
  })),
  on(ApodActions.changeCurrentPage, (state, { currentPage }) => ({
    ...state,
    page: currentPage,
  }))
);
