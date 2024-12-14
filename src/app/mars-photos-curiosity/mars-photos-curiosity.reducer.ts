import { createReducer, on } from '@ngrx/store';
import { MarsModel } from '../models/mars/mars.model';
import { MarsCuriosityActions } from './mars-photos-curiosity.actions';

export interface MarsCuriosityState {
  data: MarsModel[];
  maxSol: number;
  isLoading: boolean;
  error: string | null;
}

export const initialState: MarsCuriosityState = {
  data: [],
  maxSol: 0,
  isLoading: false,
  error: null,
};

export const marsCuriosityReducer = createReducer(
  initialState,
  on(MarsCuriosityActions.loadData, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(MarsCuriosityActions.loadDataSuccess, (state, { data, maxSol }) => ({
    ...state,
    data: [...state.data, ...data],
    maxSol: maxSol,
    isLoading: false,
    error: null,
  })),
  on(MarsCuriosityActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
