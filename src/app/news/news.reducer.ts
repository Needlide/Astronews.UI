import { createReducer, on } from '@ngrx/store';
import { NewsActions } from './news.actions';
import { NewsModel } from '../models/news/news.model';

export interface NewsState {
  data: NewsModel[];
  isLoading: boolean;
  isSearchState: boolean;
  error: string | null;
  page: number;
  totalItems: number;
  itemsPerPage: number;
  searchState: NewsSearchState;
}

interface NewsSearchState {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  searchQuery: string;
}

export const initialState: NewsState = {
  data: [],
  isLoading: false,
  isSearchState: false,
  error: null,
  page: 1,
  totalItems: 0,
  itemsPerPage: 40,
  searchState: {
    page: 1,
    totalItems: 0,
    itemsPerPage: 40,
    searchQuery: '',
  },
};

export const newsReducer = createReducer(
  initialState,
  on(NewsActions.loadData, (state) => ({
    ...state,
    isLoading: true,
    isSearchState: false,
    error: null,
  })),
  on(NewsActions.loadDataSuccess, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    error: null,
  })),
  on(NewsActions.loadDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(NewsActions.initiateSearch, (state) => ({
    ...state,
    isLoading: true,
    isSearchState: true,
    error: null,
  })),
  on(NewsActions.initiateSearchSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
    error: null,
  })),
  on(NewsActions.initiateSearchFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(NewsActions.setPage, (state, { currentPage }) =>
    updatePagination(state, true, 'default', currentPage, state.itemsPerPage)
  ),
  on(NewsActions.setSearchPage, (state, { searchPage }) =>
    updatePagination(
      state,
      true,
      'search',
      searchPage,
      state.searchState.itemsPerPage
    )
  ),
  on(NewsActions.setItemsPerPage, (state, { itemsPerPage }) =>
    updatePagination(state, true, 'default', 1, itemsPerPage)
  ),
  on(NewsActions.setSearchItemsPerPage, (state, { searchItemsPerPage }) =>
    updatePagination(state, true, 'search', 1, searchItemsPerPage)
  ),
  on(NewsActions.setError, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(NewsActions.setTotalItems, (state, { totalItems }) => ({
    ...state,
    totalItems,
  })),
  on(NewsActions.setTotalSearchItems, (state, { totalSearchItems }) => ({
    ...state,
    searchState: { ...state.searchState, totalItems: totalSearchItems },
  })),
  on(NewsActions.setSearchQuery, (state, { searchTerm }) => ({
    ...state,
    searchState: { ...state.searchState, searchQuery: searchTerm },
  }))
);

const updatePagination = (
  state: NewsState,
  isLoading: boolean,
  paginationType: 'default' | 'search',
  page: number,
  itemsPerPage: number
) => {
  if (paginationType === 'default') {
    return {
      ...state,
      isLoading: isLoading,
      page: page,
      itemsPerPage: itemsPerPage,
    };
  } else {
    return {
      ...state,
      isLoading: isLoading,
      searchState: {
        ...state.searchState,
        page: page,
        itemsPerPage: itemsPerPage,
      },
    };
  }
};
