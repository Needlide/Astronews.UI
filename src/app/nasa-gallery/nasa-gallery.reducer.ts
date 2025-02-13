import { createReducer, on } from '@ngrx/store';
import { NasaGalleryActions } from './nasa-gallery.actions';
import { Data } from '../models/gallery/gallery.root.model';

export interface NasaGalleryState {
  data: Data[];
  isLoading: boolean;
  isSearchState: boolean;
  error: string | null;
  page: number;
  totalItems: number;
  itemsPerPage: number;
  searchState: NasaGallerySearchState;
}

interface NasaGallerySearchState {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  searchQuery: string;
}

export const initialState: NasaGalleryState = {
  data: [],
  isLoading: false,
  isSearchState: false,
  error: null,
  page: 1,
  totalItems: 0,
  itemsPerPage: 20,
  searchState: {
    page: 1,
    totalItems: 0,
    itemsPerPage: 40,
    searchQuery: '',
  },
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
  })),
  on(NasaGalleryActions.initiateSearch, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(NasaGalleryActions.initiateSearchSuccess, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    error: null,
  })),
  on(NasaGalleryActions.initiateSearchFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(NasaGalleryActions.setPage, (state, { currentPage }) =>
    updatePagination(state, true, 'default', currentPage, state.itemsPerPage)
  ),
  on(NasaGalleryActions.setSearchPage, (state, { searchPage }) =>
    updatePagination(
      state,
      true,
      'search',
      searchPage,
      state.searchState.itemsPerPage
    )
  ),
  on(NasaGalleryActions.setItemsPerPage, (state, { itemsPerPage }) =>
    updatePagination(state, true, 'default', 1, itemsPerPage)
  ),
  on(
    NasaGalleryActions.setSearchItemsPerPage,
    (state, { searchItemsPerPage }) =>
      updatePagination(state, true, 'search', 1, searchItemsPerPage)
  ),
  on(NasaGalleryActions.setTotalItems, (state, { totalItems }) => ({
    ...state,
    totalItems: totalItems,
  })),
  on(NasaGalleryActions.setTotalSearchItems, (state, { totalSearchItems }) => ({
    ...state,
    searchState: { ...state.searchState, totalItems: totalSearchItems },
  })),
  on(NasaGalleryActions.setSearchQuery, (state, { searchTerm }) => ({
    ...state,
    searchState: { ...state.searchState, searchQuery: searchTerm },
  })),
  on(NasaGalleryActions.setError, (state, { error }) => ({
    ...state,
    error: error,
  }))
);

const updatePagination = (
  state: NasaGalleryState,
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
