import { createReducer, on } from '@ngrx/store';
import { loadNews, loadNewsSuccess, loadNewsFailure } from './news.actions';
import { NewsModel } from '../models/news.model';

export interface NewsState {
  data: NewsModel[];
  nextUrl: string;
  isLoading: boolean;
  error: string | null;
}

export const initialState: NewsState = {
  data: [],
  nextUrl: '',
  isLoading: false,
  error: null
};

export const newsReducer = createReducer(
  initialState,
  on(loadNews, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(loadNewsSuccess, (state, { data, nextUrl }) => ({
    ...state,
    data: [...state.data, ...data],
    nextUrl,
    isLoading: false,
    error: null
  })),
  on(loadNewsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);

