import { createActionGroup, props } from '@ngrx/store';
import { MarsModel } from '../models/mars/mars.model';

export const MarsCuriosityActions = createActionGroup({
  source: 'Mars Curiosity Page',
  events: {
    'Load Data': props<{ url: string; cacheKey: string }>(),
    'Load Data Success': props<{
      data: MarsModel[];
      maxSol: number;
    }>(),
    'Load Data Failure': props<{ error: string }>(),
  },
});
