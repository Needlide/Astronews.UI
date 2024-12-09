import { Injectable } from '@angular/core';
import { CachingService } from '../cache/caching.service';
import { SearchService } from './search.service';
import { DataService } from '../data.service';
import { PromptService } from '../shared/prompt.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { UrlBuilderService } from '../url-builder.service';
import {
  errorMessageDataFetch,
  errorUrl,
  errorUrlMarsCuriosity,
  minSymbolsToTriggerSearch,
} from '../shared/constants';
import { catchError, map, of } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { parseSearchTerm, parseSearchValue } from './search.util';
import { Rovers } from '../models/mars/rovers';
import {
  CuriosityCameras,
  MarsRoverCameras,
} from '../models/mars/rover.cameras';

@Injectable({
  providedIn: 'root',
})
export class MarsCuriositySearchService {
  constructor(
    private cacheService: CachingService,
    private searchService: SearchService,
    private dataService: DataService,
    private promptService: PromptService,
    private errorService: ErrorService,
    private router: Router,
    private urlBuilder: UrlBuilderService
  ) {}

  search() {
    let term = this.searchService.getSearchTerm();

    if (!term || term.length < minSymbolsToTriggerSearch) {
      return of([]);
    }

    let cache = this.cacheService.get(PAGE_KEYS.MARS_CURIOSITY, term);

    if (cache) {
      return of(cache);
    }

    let defaultCache = this.cacheService.get(
      PAGE_KEYS.MARS_CURIOSITY,
      DEFAULT_CACHE_KEYS.MARS_CURIOSITY
    );

    if (!defaultCache) {
      return of([]);
    }

    const { property, value } = parseSearchTerm(term);

    // TODO dispatch action to the caching service so the data received from API call could be cached
    switch (property?.toLowerCase()) {
      case 's':
        const valueSign = parseSearchValue(value);
        let sol = parseInt(
          valueSign[0].includes('+') || valueSign[0].includes('-')
            ? valueSign[1]
            : valueSign[0]
        );

        let urlS = this.urlBuilder.getMarsUrl(
          sol.toString(),
          undefined,
          Rovers.Curiosity
        );
        return this.apiCall(urlS, term);
      case 'cn':
        let urlCn = this.urlBuilder.getMarsUrl(
          this.promptService.MarsCuriosityCurrentSol.toString(),
          undefined,
          Rovers.Curiosity,
          this.parseCameraName(value)
        );

        return this.apiCall(urlCn, term);
      case 'ed':
        if (this.isISO8601Date(value)) {
          let urlEd = this.urlBuilder.getMarsUrl(
            undefined,
            value,
            Rovers.Curiosity
          );
          return this.apiCall(urlEd, term);
        }
        return of([]);
      default:
        return of([]);
    }
  }

  private apiCall(url: string, key: string) {
    return this.dataService.getMarsPhotos(url).pipe(
      map((responseData) => {
        if (responseData.photos.length == 0) {
          return of([]);
        }

        const data = responseData.photos;

        // updating the current sol variable with the new value
        // so the page knows new starting point for pagination
        this.promptService.MarsCuriosityCurrentSol = data[0].sol;

        return of(data);
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);
        this.router.navigate([errorUrl], {
          state: { returnUrl: errorUrlMarsCuriosity },
        });

        return of([]);
      })
    );
  }

  // map enum of the camera names to the user's input
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

  // check if the input is an ISO8601 date format (YYYY-MM-DD)
  private isISO8601Date(dateString: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }
}
