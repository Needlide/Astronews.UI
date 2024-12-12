import { Data } from './gallery.root.model';

export interface GalleryCache {
  data: Data[];
  nextUrl: string;
  prevUrl: string;
}
