import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { UrlBuilderService } from '../url-builder.service';
import { errorMessageDataFetch } from '../shared/constants';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { parseSearchTerm } from './search.util';
import { Rovers } from '../models/mars/rovers';
import {
  CuriosityCameras,
  MarsRoverCameras,
} from '../models/mars/rover.cameras';
import { isISO8601Date } from '../shared/date-functions';
import { MarsModel } from '../models/mars/mars.model';
import { CachingCuriosityService } from '../cache/mars-curiosity/caching-curiosity.service';
import { ManifestModel } from '../models/mars/manifest.model';

@Injectable({
  providedIn: 'root',
})
export class MarsCuriositySearchService {
  constructor(
    private cacheService: CachingCuriosityService,
    private dataService: DataService,
    private errorService: ErrorService,
    private urlBuilder: UrlBuilderService
  ) {}

  load(sol: number): Observable<MarsModel[]> {
    const cache = this.cacheService.getPagination(sol);

    if (cache) {
      return of(cache);
    }

    const requestUrl = this.urlBuilder.getMarsUrl(
      Rovers.Curiosity,
      sol.toString()
    );

    return this.apiCall(requestUrl).pipe(
      take(1),
      tap((data) => this.cacheService.setPagination(sol, data))
    );
  }

  search(sol: number, searchTerm: string): Observable<MarsModel[]> {
    let cache = this.cacheService.getSearch(searchTerm);

    if (cache) {
      return of(cache);
    }

    let { property, value } = parseSearchTerm(searchTerm);

    if (property) {
      return this.propertySearchLogic(sol, property, value);
    }

    return this.valueSearchLogic(sol, value);
  }

  private propertySearchLogic(sol: number, property: string, value: string) {
    switch (property?.toLowerCase()) {
      case 's':
        let urlS = this.urlBuilder.getMarsUrl(Rovers.Curiosity, value);
        return this.apiCall(urlS);
      case 'cn':
        let urlCn = this.urlBuilder.getMarsUrl(
          Rovers.Curiosity,
          sol.toString(),
          undefined,
          this.parseCameraName(value)
        );

        return this.apiCall(urlCn);
      case 'ed':
        if (isISO8601Date(value)) {
          let urlEd = this.urlBuilder.getMarsUrl(
            Rovers.Curiosity,
            undefined,
            value
          );
          return this.apiCall(urlEd);
        }
        return of([]);
      default:
        return of([]);
    }
  }

  private valueSearchLogic(
    sol: number,
    value: string
  ): Observable<MarsModel[]> {
    if (isISO8601Date(value)) {
      let urlEd = this.urlBuilder.getMarsUrl(
        Rovers.Curiosity,
        undefined,
        value
      );

      return this.apiCall(urlEd);
    } else if (this.isInteger(value)) {
      let urlS = this.urlBuilder.getMarsUrl(Rovers.Curiosity, value);

      return this.apiCall(urlS);
    } else {
      let camera = this.parseCameraName(value);

      if (camera) {
        let urlCn = this.urlBuilder.getMarsUrl(
          Rovers.Curiosity,
          sol.toString(),
          undefined,
          camera
        );

        return this.apiCall(urlCn);
      }
    }

    return of([]);
  }

  private apiCall(url: string): Observable<MarsModel[]> {
    return this.dataService.getMarsPhotos(url).pipe(
      map((responseData) => {
        if (!responseData || responseData.photos.length == 0) return [];

        return responseData.photos;
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);

        return [];
      })
    );
  }

  getManifest(): Observable<ManifestModel> {
    let url = this.urlBuilder.getMarsManifestUrl(Rovers.Curiosity);

    return this.dataService.getMarsManifest(url).pipe(
      map((data) => data.photo_manifest),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);

        return of({} as ManifestModel);
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

  private isInteger(value: string): boolean {
    const regex = /^[0-9]+$/;
    return regex.test(value);
  }
}
