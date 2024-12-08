import { Component } from '@angular/core';
import { MarsModel } from '../models/mars/mars.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { SearchService } from '../search/search.service';
import { parseSearchTerm, parseSearchValue } from '../search/search.util';
import { Rovers } from '../models/mars/rovers';
import { UrlBuilderService } from '../url-builder.service';
import { CachingService } from '../cache/caching.service';
import { lastValueFrom } from 'rxjs';
import {
  CuriosityCameras,
  MarsRoverCameras,
} from '../models/mars/rover.cameras';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos-curiosity.component.html',
  styleUrls: ['./mars-photos-curiosity.component.scss'],
})
export class MarsPhotosCuriosityComponent {
  data: MarsModel[] = [];
  private readonly cache_keyword = 'curiosity';
  private readonly rover_type = Rovers.Curiosity;
  private last_sol: number = 0;
  private sol: number = 0;
  private solDirection: boolean = false;
  private scrollDownTriggered: boolean = false;
  private edSearch: boolean = false;
  private currentUrl: string = '/MarsPhotos/Curiosity';

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private cacheService: CachingService,
    private urlBuilder: UrlBuilderService,
    private searchService: SearchService
  ) {
    searchService.searchTerm$.subscribe(this.callApiSearch.bind(this));
  }

  private parseSolDirection(value: string): boolean {
    return value.trim().startsWith('+') || value.trim().endsWith('+');
  }

  private parseCameraName(value: string): MarsRoverCameras | undefined {
    switch (value.toUpperCase()) {
      case 'FHAZ':
        return CuriosityCameras.FHAZ;
      case 'RHAZ':
        return CuriosityCameras.RHAZ;
      case 'MAST':
        return CuriosityCameras.MAST;
      case 'CHEMCAM':
        return CuriosityCameras.CHEMCAM;
      case 'MAHLI':
        return CuriosityCameras.MAHLI;
      case 'MARDI':
        return CuriosityCameras.MARDI;
      case 'NAVCAM':
        return CuriosityCameras.NAVCAM;
      default:
        return undefined;
    }
  }

  private handleSearch(term: string): string {
    const { property, value } = parseSearchTerm(term);
    if (property && value) {
      switch (property.toLowerCase()) {
        case 's':
          if (!this.scrollDownTriggered) {
            const valueSign = parseSearchValue(value);
            this.sol = parseInt(
              valueSign[0].includes('+') || valueSign[0].includes('-')
                ? valueSign[1]
                : valueSign[0]
            );
            this.scrollDownTriggered = false;
          }
          this.scrollDownTriggered = false;
          this.solDirection = this.parseSolDirection(value);
          this.edSearch = false;
          return this.urlBuilder.getMarsUrl(
            this.sol.toString(),
            undefined,
            this.rover_type
          );
        case 'cn':
          this.edSearch = false;
          return this.urlBuilder.getMarsUrl(
            this.sol.toString(),
            undefined,
            this.rover_type,
            this.parseCameraName(value)
          );
        case 'ed':
          this.edSearch = true;
          return this.urlBuilder.getMarsUrl(
            this.sol.toString(),
            value,
            this.rover_type
          );
        default:
          this.edSearch = false;
          return '';
      }
    } else if (!value) {
      this.edSearch = false;
      return '';
    } else {
      if (this.isISO8601Date(value)) {
        this.edSearch = true;
        return this.urlBuilder.getMarsUrl(undefined, value, this.rover_type);
      } else if (this.containsOnlyAlphabet(value)) {
        this.edSearch = false;
        return this.urlBuilder.getMarsUrl(
          this.sol.toString(),
          undefined,
          this.rover_type,
          this.parseCameraName(value)
        );
      } else {
        this.edSearch = false;
        return this.urlBuilder.getMarsUrl(value, undefined, this.rover_type);
      }
    }
  }

  private async clearApiCall(url: string, isLatest: boolean): Promise<void> {
    try {
      if (isLatest) {
        const responseData = await lastValueFrom(
          this.apiCaller.getMarsLatestPhotos(url)
        );
        this.data = responseData.latest_photos;
        if (this.data.length > 0) {
          this.last_sol = this.data[0].sol;
          this.sol = this.last_sol;
        }
        this.cacheService.set(url, this.data);
      } else {
        const responseData = await lastValueFrom(
          this.apiCaller.getMarsPhotos(url)
        );
        this.data = responseData.photos;
        if (this.data.length > 0) {
          this.sol = this.data[0].sol;
        }
        this.cacheService.set(url, this.data);
      }
    } catch (error) {
      let currentUrl = this.router.url;
      this.errorService.sendError(
        'Error occurred during fetching the data. Please, try again shortly.'
      );
      this.router.navigate(['/Error'], {
        state: { returnUrl: this.currentUrl },
      });
    }
  }

  private async apiCall(url: string): Promise<void> {
    try {
      const responseData = await lastValueFrom(
        this.apiCaller.getMarsPhotos(url)
      );
      if (responseData.photos.length == 0) {
        await this.onScrollDown();
      } else {
        this.data = [...this.data, ...responseData.photos];
        if (this.data.length > 0) {
          this.sol = this.data[0].sol;
        }
        this.cacheService.set(url, this.data);
      }
    } catch (error) {
      this.errorService.sendError(
        'Error occurred during fetching the data. Please, try again shortly.'
      );
      this.router.navigate(['/Error'], {
        state: { returnUrl: this.currentUrl },
      });
    }
  }

  private async callApiSearch(term: string) {
    const url = this.handleSearch(term);

    if (url) {
      const cache = this.cacheService.get(url);
      if (cache) {
        this.data = cache;
        if (this.data.length > 0) {
          this.sol = this.data[0].sol;
        }
      } else {
        await this.clearApiCall(url, false);
      }
    } else {
      let urlDef = this.urlBuilder.getMarsLatestUrl(this.rover_type);
      let cacheDef = this.cacheService.get(urlDef);
      if (cacheDef) {
        this.data = cacheDef;
        if (this.data.length > 0) {
          this.sol = this.data[0].sol;
        }
      } else {
        await this.clearApiCall(urlDef, true);
      }
    }
  }

  async onScrollDown(): Promise<void> {
    if (!this.edSearch) {
      this.scrollDownTriggered = true;
      this.sol += this.solDirection ? 1 : -1;
      if (this.sol < 0) {
        this.sol = 0;
      }
      const term = this.searchService.getSearchTerm();
      const url = this.handleSearch(term);
      if (url) {
        await this.apiCall(url);
      } else {
        await this.apiCall(
          this.urlBuilder.getMarsUrl(
            this.sol.toString(),
            undefined,
            this.rover_type
          )
        );
      }
    } else {
      this.sol++;
      await this.apiCall(
        this.urlBuilder.getMarsUrl(
          this.sol.toString(),
          undefined,
          this.rover_type
        )
      );
    }
  }

  private isISO8601Date(dateString: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  private containsOnlyAlphabet(input: string): boolean {
    return /^[a-zA-Z]+$/.test(input);
  }
}
