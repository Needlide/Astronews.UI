import { createActionGroup, props } from '@ngrx/store';
import { ApodModel } from '../models/apod/apod.model';

export const ApodActions = createActionGroup({
  source: 'APOD Page',
  events: {
    'Load Data': props<{ url: string; cacheKey: string }>(),
    'Load Data Success': props<{
      data: ApodModel[];
      nextUrl: string;
      prevUrl: string;
    }>(),
    'Load Data Failure': props<{ error: string }>(),
    'Set Current Page': props<{ currentPage: number }>(),
    'Set Search Query': props<{ query: string }>(),
  },
});
