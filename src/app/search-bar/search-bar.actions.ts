import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SearchActions = createActionGroup({
  source: 'Search',
  events: {
    'Set Search Term': props<{ term: string }>(), // search initiated
    'Clear Search Term': emptyProps(),
    'Set Search Results': props<{ results: any[] }>(),
    'Clear Search Results': emptyProps()
  }
});

