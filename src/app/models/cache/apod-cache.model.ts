import { ApodModel } from '../apod/apod.model';

export interface ApodCache {
  data: ApodModel[];
  nextStartYear: string;
  prevStartYear: string;
  nextEndYear: string;
  prevEndYear: string;
}
