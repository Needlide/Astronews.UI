import { createReducer, on } from '@ngrx/store';
import { MarsModel } from '../models/mars/mars.model';
import { MarsCuriosityActions } from './mars-photos-curiosity.actions';

export interface MarsCuriosityState {
  data: MarsModel[];
  isLoading: boolean;
  error: string | null;
  maxSol: number;
  maxDate: string;
  totalItems: number;
  searchQuery: string;
  currentSol: number;
  paginationEnabled: boolean;
}

export const initialState: MarsCuriosityState = {
  data: [],
  isLoading: false,
  error: null,
  maxSol: 0,
  maxDate: '',
  totalItems: 0,
  searchQuery: '',
  currentSol: 0,
  paginationEnabled: true,
};

export const marsCuriosityReducer = createReducer(
  initialState,
  on(MarsCuriosityActions.loadManifest, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(MarsCuriosityActions.loadManifestSuccess, (state, { data }) => ({
    ...state,
    totalItems: data.total_photos,
    maxDate: data.max_date,
    maxSol: data.max_sol,
    currentSol: data.max_sol,
    error: null,
  })),
  on(MarsCuriosityActions.loadManifestFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(MarsCuriosityActions.loadData, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(MarsCuriosityActions.loadDataSuccess, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    error: null,
  })),
  on(MarsCuriosityActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(MarsCuriosityActions.initiateSearch, (state) => ({
    ...state,
    isLoading: true,
    error: null,
    paginationEnabled: false,
  })),
  on(MarsCuriosityActions.initiateSearchSuccess, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    error: null,
  })),
  on(MarsCuriosityActions.initiateSearchFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
    paginationEnabled: true,
  })),
  on(MarsCuriosityActions.setSearchQuery, (state, { searchTerm }) => ({
    ...state,
    searchQuery: searchTerm,
  })),
  on(MarsCuriosityActions.setSol, (state, { currentSol }) => ({
    ...state,
    currentSol: currentSol,
  })),
  on(MarsCuriosityActions.setMaxSol, (state, { maxSol }) => ({
    ...state,
    maxSol: maxSol,
  })),
  on(MarsCuriosityActions.setMaxDate, (state, { maxDate }) => ({
    ...state,
    maxDate: maxDate,
  })),
  on(MarsCuriosityActions.setTotalItems, (state, { totalItems }) => ({
    ...state,
    totalItems: totalItems,
  })),
  on(MarsCuriosityActions.setError, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  }))
);
