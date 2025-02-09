export interface ManifestModelRoot {
  photo_manifest: ManifestModel;
}

export interface ManifestModel {
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  photos: ManifestPhoto[];
}

interface ManifestPhoto {
  sol: number;
  earth_date: string;
  total_photos: number;
  cameras: string[];
}
