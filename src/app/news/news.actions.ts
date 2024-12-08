import { createActionGroup, props } from '@ngrx/store';
import { NewsModel } from '../models/news/news.model';

export const NewsActions = createActionGroup({
  source: 'News Page',
  events: {
    'Load Data': props<{ url: string; cacheKey: string }>(),
    'Load Data Success': props<{ data: NewsModel[]; nextUrl: string }>(),
    'Load Data Failure': props<{ error: string }>(),
    'Set Current Page': props<{ currentPage: number }>(),
    'Set Items Per Page': props<{ itemsPerPage: number }>(),
    'Set Search Query': props<{ query: string }>(),
    'Parse Search Query': props<{ prefix: string | null; term: string }>(),
    'Perform Search': props<{ prefix: string | null; term: string }>(),
    'Search Success': props<{ results: NewsModel[] }>(),
    'Search Failure': props<{ error: string }>(),
  },
});
