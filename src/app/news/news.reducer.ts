import { createReducer, on } from '@ngrx/store';
import { NewsActions } from './news.actions';
import { NewsModel } from '../models/news/news.model';

export interface NewsState {
  data: NewsModel[];
  nextUrl: string;
  prevUrl: string;
  isLoading: boolean;
  error: string | null;
}

export const initialState: NewsState = {
  data: [],
  nextUrl: '',
  prevUrl: '',
  isLoading: false,
  error: null,
};

export const newsReducer = createReducer(
  initialState,
  on(NewsActions.loadData, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(NewsActions.loadDataSuccess, (state, { data, nextUrl, prevUrl }) => ({
    ...state,
    data: [...state.data, ...data],
    nextUrl,
    prevUrl,
    isLoading: false,
    error: null,
  })),
  on(NewsActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
