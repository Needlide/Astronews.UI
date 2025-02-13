import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Data } from '../models/gallery/gallery.root.model';

export const NasaGalleryActions = createActionGroup({
  source: 'Nasa Gallery Page',
  events: {
    'Load Data': emptyProps(),
    'Load Data Success': props<{ data: Data[] }>(),
    'Load Data Failure': props<{ error: string }>(),

    'Initiate Search': emptyProps(),
    'Initiate Search Success': props<{ data: Data[] }>(),
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
