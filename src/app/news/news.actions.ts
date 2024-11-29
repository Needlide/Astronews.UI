import { createAction, props } from '@ngrx/store';
import { NewsModel } from '../models/news.model';

export const loadNews = createAction('[News] Load News', props<{ url: string, cacheKey: string }>());
export const loadNewsSuccess = createAction('[News] Load News Success', props<{ data: NewsModel[], nextUrl: string }>());
export const loadNewsFailure = createAction('[News] Load News Failure', props<{ error: string }>());

