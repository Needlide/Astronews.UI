import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { NewsModel } from '../models/news/news.model';

export const NewsActions = createActionGroup({
  source: 'News Page',
  events: {
    'Load Data': emptyProps(),
    'Load Data Success': props<{
      data: NewsModel[];
    }>(),
    'Load Data Failure': props<{ error: string }>(),

    'Initiate Search': emptyProps(),
    'Initiate Search Success': props<{ data: NewsModel[] }>(),
    'Initiate Search Failure': props<{ error: string }>(),

    'Set Page': props<{ currentPage: number }>(),
    'Set Items Per Page': props<{ itemsPerPage: number }>(),
    'Set Total Items': props<{ totalItems: number }>(),

    'Set Search Page': props<{ searchPage: number }>(),
    'Set Search Items Per Page': props<{ searchItemsPerPage: number }>(),
    'Set Total Search Items': props<{ totalSearchItems: number }>(),

    'Set Error': props<{ error: string }>(),
    'Set Search Query': props<{ searchTerm: string }>(),
  },
});
