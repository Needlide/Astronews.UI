import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ApodModel } from '../models/apod/apod.model';

export const ApodActions = createActionGroup({
  source: 'APOD Page',
  events: {
    'Load Data': props<{
      startDate: Date;
      endDate: Date;
      pageNumber: number;
    }>(),
    'Load Data Success': props<{
      data: ApodModel[];
    }>(),
    'Load Data Failure': props<{ error: string }>(),
    'Initiate Search': props<{
      searchTerm: string;
      cacheKey: string;
      pageNumber: number;
    }>(),
    'Initiate Search Success': props<{ data: ApodModel[] }>(),
    'Initiate Search Failure': props<{ error: string }>(),
    'Load Page From Cache': props<{ pageNumber: number }>(),
    'Load Page From Cache Success': props<{ data: ApodModel[] }>(),
    'Load Page From Cache Failure': props<{ error: string }>(),
    'Calculate Total Items': emptyProps(),
    'Calculate Total Items Success': props<{ totalItems: number }>(),
    'Change Current Page': props<{ currentPage: number }>(),
  },
});
