import { Injectable } from '@angular/core';
import { CachingService } from '../cache/caching.service';
import { DataService } from '../data.service';
import { PromptService } from '../shared/prompt.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { UrlBuilderService } from '../url-builder.service';
import {
  errorMessageDataFetch,
  minSymbolsToTriggerSearch,
} from '../shared/constants';
import { catchError, map, Observable, of } from 'rxjs';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { parseSearchTerm, parseSearchValue } from './search.util';
import { Rovers } from '../models/mars/rovers';
import {
  CuriosityCameras,
  MarsRoverCameras,
} from '../models/mars/rover.cameras';
import { isISO8601Date } from '../shared/date-functions';
import { MarsModel } from '../models/mars/mars.model';
import { ROUTES } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class MarsCuriositySearchService {
  constructor(
    private cacheService: CachingService,
    private dataService: DataService,
    private promptService: PromptService,
    private errorService: ErrorService,
    private router: Router,
    private urlBuilder: UrlBuilderService
  ) {}

  search(term: string): Observable<MarsModel[]> {
    if (!term || term.length < minSymbolsToTriggerSearch) {
      let defaultCache = this.cacheService.get(
        PAGE_KEYS.MARS_CURIOSITY,
        DEFAULT_CACHE_KEYS.MARS_CURIOSITY
      ) as MarsModel[];

      if (defaultCache) {
        return of(defaultCache);
      } else {
        return this.apiCallLatest();
      }
    }

    let cache = this.cacheService.get(PAGE_KEYS.MARS_CURIOSITY, term);

    if (cache) {
      return of(cache);
    }

    const { property, value } = parseSearchTerm(term);

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
        if (isISO8601Date(value)) {
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

  private apiCall(url: string, key: string): Observable<MarsModel[]> {
    return this.dataService.getMarsPhotos(url).pipe(
      map((responseData) => {
        //TODO `responseData.photos` is undefined (could be just `responseData`)
        if (!responseData || responseData.photos.length == 0) {
          return [];
        }

        const data = responseData.photos;

        // updating the current sol variable with the new value
        // so the page knows new starting point for pagination
        this.promptService.MarsCuriosityCurrentSol = data[0].sol;

        this.cacheService.set(PAGE_KEYS.MARS_CURIOSITY, key, data);

        return data;
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);
        this.router.navigate([ROUTES.error], {
          state: { returnUrl: ROUTES.marsCuriosity },
        });

        return [];
      })
    );
  }

  private apiCallLatest(): Observable<MarsModel[]> {
    return this.dataService
      .getMarsLatestPhotos(this.urlBuilder.getMarsLatestUrl(Rovers.Curiosity))
      .pipe(
        map((responseData) => {
          if (!responseData || responseData.latest_photos.length == 0) {
            return [];
          }

          const data = responseData.latest_photos;

          // updating the current sol variable with the new value
          // so the page knows new starting point for pagination
          this.promptService.MarsCuriosityCurrentSol = data[0].sol;

          this.cacheService.set(
            PAGE_KEYS.MARS_CURIOSITY,
            DEFAULT_CACHE_KEYS.MARS_CURIOSITY,
            data
          );

          return data;
        }),
        catchError(() => {
          this.errorService.sendError(errorMessageDataFetch);
          this.router.navigate([ROUTES.error], {
            state: { returnUrl: ROUTES.marsCuriosity },
          });

          return [];
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
}
