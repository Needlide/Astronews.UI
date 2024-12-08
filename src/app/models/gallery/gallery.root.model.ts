import { LinkModel } from '../gallery/link.model';
import { DataModel } from '../gallery/data.model';

export interface GalleryRootModel {
  collection: Collection;
}

interface Collection {
  version: string;
  href: string;
  items: Data[];
  metadata: Object;
  links: LinkObject[];
}

export interface Data {
  data: DataModel[];
  href: string;
  links: LinkModel[];
}

interface Object {
  total_hits: number;
}

interface LinkObject {
  rel: string;
  prompt: string;
  href: string;
}
