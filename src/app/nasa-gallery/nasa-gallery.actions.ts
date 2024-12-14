import { createActionGroup, props } from '@ngrx/store';
import { GalleryModel } from '../models/gallery/gallery.model';

export const NasaGalleryActions = createActionGroup({
  source: 'Nasa Gallery Page',
  events: {
    'Load Data': props<{ url: string; cacheKey: string }>(),
    'Load Data Success': props<{ data: GalleryModel[] }>(),
    'Load Data Failure': props<{ error: string }>(),
  },
});
