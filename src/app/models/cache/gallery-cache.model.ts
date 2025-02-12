import { Data } from '../gallery/gallery.root.model';

export interface GalleryCache {
  data: Data[];
  expiry: number;
}
