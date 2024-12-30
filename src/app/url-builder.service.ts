import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { SourceManagerService } from './source-manager.service';
import { Rovers } from './models/mars/rovers';
import {
  CuriosityCameras,
  MarsRoverCameras,
  OpportunityCameras,
  PerseveranceCameras,
  SpiritCameras,
} from './models/mars/rover.cameras';

enum MediaType {
  Image,
  Video,
  Audio,
}

@Injectable({
  providedIn: 'root',
})
export class UrlBuilderService {
  constructor(private sourceManager: SourceManagerService) {}

  getNewsUrl(
    limit: number = 200,
    source: string[] = [],
    published_after: string = '',
    published_before: string = '',
    title_summary: string = '',
    summary: string[] = [],
    title: string[] = []
  ): string {
    let newsUrlBase = environment.api.newsEndpoint;

    newsUrlBase += `?limit=${limit}`;

    if (source.length > 0) {
      newsUrlBase += `&news_site=${source[0]}`;

      for (let index = 1; index < source.length; index++) {
        newsUrlBase += `%2C${source[index]}`;
      }
    }

    let bannedSources = this.sourceManager.getBannedSources();

    if (bannedSources.length > 0) {
      newsUrlBase += `&news_site_exclude=${bannedSources[0]}`;

      for (let index = 1; index < bannedSources.length; index++) {
        newsUrlBase += `%2C${bannedSources[index]}`;
      }
    }

    if (this.isISO8601Date(published_after)) {
      newsUrlBase += `&published_at_gte=${published_after}`;
    }

    if (this.isISO8601Date(published_before)) {
      newsUrlBase += `&published_at_lte=${published_before}`;
    }

    if (title_summary !== '') {
      newsUrlBase += `&search=${title_summary}`;
    }

    if (summary.length > 0) {
      newsUrlBase += `&summary_contains_one=${summary[0]}`;

      for (let index = 1; index < summary.length; index++) {
        newsUrlBase += `%2C${summary[index]}`;
      }
    }

    if (title.length > 0) {
      newsUrlBase += `&title_contains_one=${title[0]}`;

      for (let index = 1; index < title.length; index++) {
        newsUrlBase += `%2C${title[index]}`;
      }
    }

    return newsUrlBase;
  }

  getGalleryUrl(
    limit: number = 80,
    free_search: string = '',
    center: string = '',
    description: string = '',
    keywords: string[] = [],
    media_type?: MediaType,
    photographer: string = '',
    secondary_creator: string = '',
    title: string = '',
    start_year: string = '',
    end_year: string = ''
  ): string {
    let galleryUrlBase = environment.api.nasaEndpoint;

    galleryUrlBase += `?page_size=${limit}`;

    if (free_search !== '') {
      galleryUrlBase += `&q=${free_search}`;
    }

    if (center !== '') {
      galleryUrlBase += `&center=${center}`;
    }

    if (description !== '') {
      galleryUrlBase += `&description=${description}`;
    }

    if (keywords.length > 0) {
      galleryUrlBase += `&keywords=${keywords[0]}`;

      for (let index = 1; index < keywords.length; index++) {
        galleryUrlBase += `%2C${keywords[index]}`;
      }
    }

    if (media_type !== undefined) {
      galleryUrlBase += `&media_type=${MediaType[media_type].toLowerCase()}`;
    }

    if (photographer !== '') {
      galleryUrlBase += `&photographer=${photographer}`;
    }

    if (secondary_creator !== '') {
      galleryUrlBase += `&secondary_creator=${secondary_creator}`;
    }

    if (title !== '') {
      galleryUrlBase += `&title=${title}`;
    }

    if (this.isYYYYFormat(start_year)) {
      galleryUrlBase += `&year_start=${start_year}`;
    } else {
      let date = new Date();
      galleryUrlBase += `&year_start=${date.getUTCFullYear()}`;
    }

    if (this.isYYYYFormat(end_year)) {
      galleryUrlBase += `&year_end=${end_year}`;
    }

    return galleryUrlBase;
  }

  getMarsUrl(
    sol: string = '',
    earth_date: string = '',
    rover: Rovers,
    camera?: MarsRoverCameras
  ): string {
    let marsUrl = '';

    switch (rover) {
      case Rovers.Opportunity:
        marsUrl = environment.api.marsOpportunityEndpoint;

        if (camera !== undefined) {
          marsUrl += `&camera=${OpportunityCameras[camera]}`;
        }
        break;
      case Rovers.Spirit:
        marsUrl = environment.api.marsSpiritEndpoint;

        if (camera !== undefined) {
          marsUrl += `&camera=${SpiritCameras[camera]}`;
        }
        break;
      case Rovers.Perseverance:
        marsUrl = environment.api.marsPerseveranceEndpoint;

        if (camera !== undefined) {
          marsUrl += `&camera=${PerseveranceCameras[camera]}`;
        }
        break;
      case Rovers.Curiosity:
        marsUrl = environment.api.marsCuriosityEndpoint;

        if (camera !== undefined) {
          marsUrl += `&camera=${CuriosityCameras[camera]}`;
        }
        break;
    }

    if (sol !== '') {
      marsUrl += `?sol=${sol}`;
    }

    if (this.isISO8601Date(earth_date) && sol !== '') {
      marsUrl += `&earth_date=${earth_date}`;
    } else if (this.isISO8601Date(earth_date)) {
      marsUrl += `?earth_date=${earth_date}`;
    }

    return marsUrl;
  }

  getMarsLatestUrl(rover: Rovers): string {
    switch (rover) {
      case Rovers.Opportunity:
        return environment.api.marsOpportunityLatestEndpoint;
      case Rovers.Spirit:
        return environment.api.marsSpiritLatestEndpoint;
      case Rovers.Perseverance:
        return environment.api.marsPerseveranceLatestEndpoint;
      case Rovers.Curiosity:
        return environment.api.marsCuriosityLatestEndpoint;
    }
  }

  private isISO8601Date(dateString: string): boolean {
    const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;

    return iso8601Pattern.test(dateString);
  }

  private isYYYYFormat(year: string): boolean {
    return /^\d{4}$/.test(year);
  }
}
