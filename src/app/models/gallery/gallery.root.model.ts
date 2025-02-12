import { GalleryModel } from './gallery.model';

export interface GalleryRootModel {
  collection: Collection;
}

interface Collection {
  version: string;
  href: string;
  items: Data[];
  metadata: Metadata;
  links: Links[];
}

export interface Data {
  data: GalleryModel[];
  href: string;
  links: LinkModel[];
}

interface Metadata {
  total_hits: number;
}

interface Links {
  rel: string;
  prompt: string;
  href: string;
}

interface LinkModel {
  href: string;
  rel: string;
  render: string;
  width: number;
  size: number;
  height: number;
}
