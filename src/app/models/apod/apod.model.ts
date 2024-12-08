import { DTO } from '@/app/shared/model.interface';

export interface ApodModel extends DTO {
  id: number;
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}
