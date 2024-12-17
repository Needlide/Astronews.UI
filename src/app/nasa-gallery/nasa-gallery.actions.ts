import { createActionGroup, props } from '@ngrx/store';
import { Data } from '../models/gallery/gallery.root.model';

export const NasaGalleryActions = createActionGroup({
  source: 'Nasa Gallery Page',
  events: {
    'Load Data': props<{ searchTerm: string }>(),
    'Load Data Success': props<{ data: Data[] }>(),
    'Load Data Failure': props<{ error: string }>(),
  },
});
