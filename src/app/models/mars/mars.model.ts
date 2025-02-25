import { CameraModel } from './camera.model';
import { RoverModel } from './rover.model';

export interface MarsRootModel {
  photos: MarsModel[];
}

export type MarsRootLatestModel = Omit<MarsRootModel, 'photos'> & {
  latest_photos: MarsModel[];
};

export interface MarsModel {
  id: number;
  sol: number;
  camera: CameraModel;
  img_src: string;
  earth_date: string;
  rover: RoverModel;
}
