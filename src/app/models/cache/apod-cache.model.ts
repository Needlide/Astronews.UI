import { ApodModel } from '../apod/apod.model';

export interface ApodCache {
  data: ApodModel[];
  paginationValues: ApodPayload[];
}

export interface ApodPayload {
  startDate: Date;
  endDate: Date;
}
