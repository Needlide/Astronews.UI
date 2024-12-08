import { RoverCameraModel } from "./rover-camera.model";

export interface RoverModel{
    id: number;
    name: string;
    landing_date: any;
    launch_date: any;
    status: string;
    max_sol: number;
    max_date: any;
    total_photos: number;
    cameras: RoverCameraModel[];
}