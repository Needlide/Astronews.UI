import { ApodModel } from '../apod/apod.model';

export interface ApodCache {
  data: ApodModel[];
  expiry: number;
}
