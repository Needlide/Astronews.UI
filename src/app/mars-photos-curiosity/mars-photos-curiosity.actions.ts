import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MarsModel } from '../models/mars/mars.model';
import { ManifestModel } from '../models/mars/manifest.model';

export const MarsCuriosityActions = createActionGroup({
  source: 'Mars Curiosity Page',
  events: {
    'Load Manifest': emptyProps(),
    'Load Manifest Success': props<{
      data: ManifestModel;
    }>(),
    'Load Manifest Failure': props<{ error: string }>(),

    'Initiate Search': emptyProps(),
    'Initiate Search Success': props<{ data: MarsModel[] }>(),
    'Initiate Search Failure': props<{ error: string }>(),

    'Set Sol': props<{ currentSol: number }>(),

    'Load Data': emptyProps(),
    'Load Data Success': props<{ data: MarsModel[] }>(),
    'Load Data Failure': props<{ error: string }>(),

    'Set Max Sol': props<{ maxSol: number }>(),
    'Set Max Date': props<{ maxDate: string }>(),
    'Set Total Items': props<{ totalItems: number }>(),

    'Set Error': props<{ error: string }>(),
    'Set Search Query': props<{ searchTerm: string }>(),
  },
});
