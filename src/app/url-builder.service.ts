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
import { isISO8601Date, isYYYYFormat } from './shared/date-functions';

enum MediaType {
  Image,
  Video,
  Audio,
}

const roverEndpoints = {
  [Rovers.Opportunity]: environment.api.marsOpportunityEndpoint,
  [Rovers.Spirit]: environment.api.marsSpiritEndpoint,
  [Rovers.Perseverance]: environment.api.marsPerseveranceEndpoint,
  [Rovers.Curiosity]: environment.api.marsCuriosityEndpoint,
};

@Injectable({
  providedIn: 'root',
})
export class UrlBuilderService {
  constructor(private sourceManager: SourceManagerService) {}

  getNewsUrl(
    limit: number = 200,
    offset: number = 0,
    source: string[] = [],
    published_after: string = '',
    published_before: string = '',
    title_summary: string = '',
    summary: string[] = [],
    title: string[] = []
  ): string {
    let newsUrlBase = environment.api.newsEndpoint;

    newsUrlBase += `?limit=${limit}`;

    newsUrlBase += `&offset=${offset}`;

    if (source.length > 0) {
      newsUrlBase += `&news_site=${source[0]}`;

      for (let index = 1; index < source.length; index++) {
        newsUrlBase += `%2C${source[index]}`;
      }
    }

    // TODO implement adding banned sources by user
    let bannedSources = this.sourceManager.getBannedSources();

    if (bannedSources.length > 0) {
      newsUrlBase += `&news_site_exclude=${bannedSources[0]}`;

      for (let index = 1; index < bannedSources.length; index++) {
        newsUrlBase += `%2C${bannedSources[index]}`;
      }
    }

    if (isISO8601Date(published_after)) {
      newsUrlBase += `&published_at_gte=${published_after}`;
    }

    if (isISO8601Date(published_before)) {
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

    if (isYYYYFormat(start_year)) {
      galleryUrlBase += `&year_start=${start_year}`;
    } else {
      let date = new Date();
      galleryUrlBase += `&year_start=${date.getUTCFullYear()}`;
    }

    if (isYYYYFormat(end_year)) {
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
    let marsUrl = roverEndpoints[rover] || '';

    if (camera !== undefined) {
      const cameraKey = this.getCameraKey(rover, camera);
      if (cameraKey) marsUrl += `&camera=${cameraKey}`;
    }

    if (sol !== '') marsUrl += `?sol=${sol}`;
    if (isISO8601Date(earth_date)) marsUrl += `&earth_date=${earth_date}`;

    return marsUrl;
  }

  getMarsLatestUrl(rover: Rovers): string {
    const roverLatestUrls = {
      [Rovers.Opportunity]: environment.api.marsOpportunityLatestEndpoint,
      [Rovers.Spirit]: environment.api.marsSpiritLatestEndpoint,
      [Rovers.Perseverance]: environment.api.marsPerseveranceLatestEndpoint,
      [Rovers.Curiosity]: environment.api.marsCuriosityLatestEndpoint,
    };
    return roverLatestUrls[rover];
  }

  private getCameraKey(
    rover: Rovers,
    camera: MarsRoverCameras
  ): string | undefined {
    const cameraMapping = {
      [Rovers.Opportunity]: OpportunityCameras,
      [Rovers.Spirit]: SpiritCameras,
      [Rovers.Perseverance]: PerseveranceCameras,
      [Rovers.Curiosity]: CuriosityCameras,
    };
    return cameraMapping[rover]?.[camera];
  }
}
