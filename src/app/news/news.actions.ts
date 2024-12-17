import { createActionGroup, props } from '@ngrx/store';
import { NewsModel } from '../models/news/news.model';

export const NewsActions = createActionGroup({
  source: 'News Page',
  events: {
    'Load Data': props<{ searchTerm: string }>(),
    'Load Data Success': props<{
      data: NewsModel[];
    }>(),
    'Load Data Failure': props<{ error: string }>(),
    'Set Current Page': props<{ currentPage: number }>(),
    'Set Items Per Page': props<{ itemsPerPage: number }>(),
    'Set Search Query': props<{ query: string }>(),
  },
});
