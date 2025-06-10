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
import {
  convertDateToString,
  isISO8601Date,
  isYYYYFormat,
} from './shared/date-functions';
import { ApiKeyService } from './api-key/api-key.service';

enum MediaType {
  Image,
  Video,
  Audio,
}

@Injectable({
  providedIn: 'root',
})
export class UrlBuilderService {
  constructor(
    private sourceManager: SourceManagerService,
    private apiKeyService: ApiKeyService
  ) {}

  getNewsUrl(
    limit: number = 40,
    offset: number = 0,
    source: string[] = [],
    published_after: string = '',
    published_before: string = '',
    title_summary: string = '',
    summary: string[] = [],
    title: string[] = []
  ): string {
    let newsUrlBase = environment.api.newsEndpoint;

    newsUrlBase = newsUrlBase.concat(`?limit=${limit}`);

    newsUrlBase = newsUrlBase.concat(`&offset=${offset}`);

    if (source.length > 0) {
      newsUrlBase = newsUrlBase.concat(`&news_site=${source[0]}`);

      for (let index = 1; index < source.length; index++) {
        newsUrlBase = newsUrlBase.concat(`%2C${source[index]}`);
      }
    }

    // TODO implement adding banned sources by user
    let bannedSources = this.sourceManager.getBannedSources();

    if (bannedSources.length > 0) {
      newsUrlBase = newsUrlBase.concat(
        `&news_site_exclude=${bannedSources[0]}`
      );

      for (let index = 1; index < bannedSources.length; index++) {
        newsUrlBase = newsUrlBase.concat(`%2C${bannedSources[index]}`);
      }
    }

    if (isISO8601Date(published_after)) {
      newsUrlBase = newsUrlBase.concat(`&published_at_gte=${published_after}`);
    }

    if (isISO8601Date(published_before)) {
      newsUrlBase = newsUrlBase.concat(`&published_at_lte=${published_before}`);
    }

    if (title_summary !== '') {
      newsUrlBase = newsUrlBase.concat(`&search=${title_summary}`);
    }

    if (summary.length > 0) {
      newsUrlBase = newsUrlBase.concat(`&summary_contains_one=${summary[0]}`);

      for (let index = 1; index < summary.length; index++) {
        newsUrlBase = newsUrlBase.concat(`%2C${summary[index]}`);
      }
    }

    if (title.length > 0) {
      newsUrlBase = newsUrlBase.concat(`&title_contains_one=${title[0]}`);

      for (let index = 1; index < title.length; index++) {
        newsUrlBase = newsUrlBase.concat(`%2C${title[index]}`);
      }
    }

    return newsUrlBase;
  }

  getGalleryUrl(
    limit: number = 60,
    page: number = 1,
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

    galleryUrlBase = galleryUrlBase.concat(`?page_size=${limit}`);

    galleryUrlBase = galleryUrlBase.concat(`&page=${page}`);

    if (free_search !== '') {
      galleryUrlBase = galleryUrlBase.concat(`&q=${free_search}`);
    }

    if (center !== '') {
      galleryUrlBase = galleryUrlBase.concat(`&center=${center}`);
    }

    if (description !== '') {
      galleryUrlBase = galleryUrlBase.concat(`&description=${description}`);
    }

    if (keywords.length > 0) {
      galleryUrlBase = galleryUrlBase.concat(`&keywords=${keywords[0]}`);

      for (let index = 1; index < keywords.length; index++) {
        galleryUrlBase = galleryUrlBase.concat(`%2C${keywords[index]}`);
      }
    }

    if (media_type !== undefined) {
      galleryUrlBase = galleryUrlBase.concat(
        `&media_type=${MediaType[media_type].toLowerCase()}`
      );
    }

    if (photographer !== '') {
      galleryUrlBase = galleryUrlBase.concat(`&photographer=${photographer}`);
    }

    if (secondary_creator !== '') {
      galleryUrlBase = galleryUrlBase.concat(
        `&secondary_creator=${secondary_creator}`
      );
    }

    if (title !== '') {
      galleryUrlBase = galleryUrlBase.concat(`&title=${title}`);
    }

    if (isYYYYFormat(start_year)) {
      galleryUrlBase = galleryUrlBase.concat(`&year_start=${start_year}`);
    } else {
      let date = new Date();
      galleryUrlBase = galleryUrlBase.concat(
        `&year_start=${date.getUTCFullYear()}`
      );
    }

    if (isYYYYFormat(end_year)) {
      galleryUrlBase = galleryUrlBase.concat(`&year_end=${end_year}`);
    }

    return galleryUrlBase;
  }

  getMarsUrl(
    rover: Rovers,
    sol?: string,
    earth_date?: string,
    camera?: MarsRoverCameras
  ): string {
    let marsUrl = this.getMarsRoverUrl(rover);

    if (sol !== undefined) marsUrl = marsUrl.concat(`&sol=${sol}`);

    if (camera !== undefined) {
      const cameraKey = this.getCameraKey(rover, camera);
      if (cameraKey) marsUrl = marsUrl.concat(`&camera=${cameraKey}`);
    }

    if (earth_date) {
      if (isISO8601Date(earth_date))
        marsUrl = marsUrl.concat(`&earth_date=${earth_date}`);
    }

    return marsUrl;
  }

  getMarsLatestUrl(rover: Rovers): string {
    const roverLatestUrls = {
      [Rovers.Opportunity]:
        environment.api.marsLatest.marsOpportunityLatestEndpoint,
      [Rovers.Spirit]: environment.api.marsLatest.marsSpiritLatestEndpoint,
      [Rovers.Perseverance]:
        environment.api.marsLatest.marsPerseveranceLatestEndpoint,
      [Rovers.Curiosity]:
        environment.api.marsLatest.marsCuriosityLatestEndpoint,
    };
    return roverLatestUrls[rover].concat(
      '?api_key=',
      this.apiKeyService.getApiKey()
    );
  }

  getMarsManifestUrl(rover: Rovers): string {
    const roverManifestUrls = {
      [Rovers.Opportunity]:
        environment.api.marsManifests.marsCuriosityManifestEndpoint,
      [Rovers.Spirit]:
        environment.api.marsManifests.marsCuriosityManifestEndpoint,
      [Rovers.Perseverance]:
        environment.api.marsManifests.marsCuriosityManifestEndpoint,
      [Rovers.Curiosity]:
        environment.api.marsManifests.marsCuriosityManifestEndpoint,
    };

    return roverManifestUrls[rover].concat(
      '?api_key=',
      this.apiKeyService.getApiKey()
    );
  }

  getApodUrl(date: Date): string {
    let apodUrlBase = environment.api.apodEndpoint;

    apodUrlBase = apodUrlBase.concat(
      `?date=${convertDateToString(date)}`,
      `&api_key=${this.apiKeyService.getApiKey()}`
    );

    return apodUrlBase;
  }

  getApodsUrl(startDate: Date, endDate: Date): string {
    let apodUrlBase = environment.api.apodEndpoint;

    apodUrlBase = apodUrlBase.concat(
      `?start_date=${convertDateToString(startDate)}`,
      `&end_date=${convertDateToString(endDate)}`,
      `&api_key=${this.apiKeyService.getApiKey()}`
    );

    return apodUrlBase;
  }

  private getMarsRoverUrl(rover: Rovers): string {
    const roverEndpoints = {
      [Rovers.Opportunity]: environment.api.marsOpportunityEndpoint,
      [Rovers.Spirit]: environment.api.marsSpiritEndpoint,
      [Rovers.Perseverance]: environment.api.marsPerseveranceEndpoint,
      [Rovers.Curiosity]: environment.api.marsCuriosityEndpoint,
    };

    return roverEndpoints[rover].concat(
      '?api_key=',
      this.apiKeyService.getApiKey()
    );
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
