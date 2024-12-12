import { ApodModel } from '../apod/apod.model';

export interface ApodCache {
  data: ApodModel[];
  nextStartYear: Date;
  prevStartYear: Date;
  nextEndYear: Date;
  prevEndYear: Date;
}
