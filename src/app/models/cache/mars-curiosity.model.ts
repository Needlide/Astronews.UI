import { MarsModel } from '../mars/mars.model';

export interface MarsCuriosityCache {
  data: MarsModel[];
  expiry: number;
}
