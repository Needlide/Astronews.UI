import { ApodModel } from '../apod/apod.model';

export interface ApodCache {
  data: ApodModel[];
  nextUrl: string;
  prevUrl: string;
}
