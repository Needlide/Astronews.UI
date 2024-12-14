import { createActionGroup, props } from '@ngrx/store';
import { ApodModel } from '../models/apod/apod.model';
import { ApodPayload } from '../models/cache/apod-cache.model';

export const ApodActions = createActionGroup({
  source: 'APOD Page',
  events: {
    'Load Data': props<{ startDate: Date; endDate: Date; cacheKey: string }>(),
    'Load Data Success': props<{
      data: ApodModel[];
      paginationValues: ApodPayload[];
    }>(),
    'Load Data Failure': props<{ error: string }>(),
    'Set Current Page': props<{ currentPage: number }>(),
    'Set Search Query': props<{ query: string }>(),
  },
});
