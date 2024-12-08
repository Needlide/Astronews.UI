import { DTO } from '@/app/shared/model.interface';

export interface GalleryModel extends DTO {
  center: string;
  date_created: any;
  description: string;
  keywords: string[];
  media_type: string;
  nasa_id: string;
  title: string;
  album: string[];
}
