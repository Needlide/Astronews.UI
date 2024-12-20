import { Injectable } from '@angular/core';
import { CachingService } from '../cache/caching.service';
import { DataService } from '../data.service';
import {
  errorMessageDataFetch,
  minSymbolsToTriggerSearch,
} from '../shared/constants';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { parseSearchTerm, parseSearchValue } from './search.util';
import { catchError, map, Observable, of } from 'rxjs';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { UrlBuilderService } from '../url-builder.service';
import { Data } from '../models/gallery/gallery.root.model';
import { ROUTES } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class GallerySearchService {
  constructor(
    private cacheService: CachingService,
    private dataService: DataService,
    private errorService: ErrorService,
    private router: Router,
    private urlBuilder: UrlBuilderService
  ) {}

  search(term: string): Observable<Data[]> {
    if (!term || term.length < minSymbolsToTriggerSearch) {
      let defaultCache = this.cacheService.get(
        PAGE_KEYS.NASA_GALLERY,
        DEFAULT_CACHE_KEYS.NASA_GALLERY
      ) as Data[];

      if (defaultCache) {
        return of(defaultCache);
      } else {
        let defaultUrl = this.urlBuilder.getGalleryUrl();
        return this.apiCall(defaultUrl, DEFAULT_CACHE_KEYS.NASA_GALLERY);
      }
    }

    let cache = this.cacheService.get(PAGE_KEYS.NASA_GALLERY, term);

    if (cache) {
      return of(cache);
    }

    let defaultCache = this.cacheService.get(
      PAGE_KEYS.NASA_GALLERY,
      DEFAULT_CACHE_KEYS.NASA_GALLERY
    );

    if (!defaultCache) {
      return of([]);
    }

    const { property, value } = parseSearchTerm(term);

    switch (property?.toLowerCase()) {
      case 't':
        let urlT = this.urlBuilder.getGalleryUrl(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlT, term);
      case 'd':
        let urlD = this.urlBuilder.getGalleryUrl(
          undefined,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlD, term);
      case 'c':
        let urlC = this.urlBuilder.getGalleryUrl(undefined, undefined, value);
        return this.apiCall(urlC, term);
      case 'dc':
        let urlDC = this.urlBuilder.getGalleryUrl(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlDC, term);
      case 'k':
        let urlK = this.urlBuilder.getGalleryUrl(
          undefined,
          undefined,
          undefined,
          undefined,
          parseSearchValue(value)
        );

        return this.apiCall(urlK, term);
      case 'ni':
        let urlP = this.urlBuilder.getGalleryUrl(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlP, term);
      default:
        return of([]);
    }
  }

  private apiCall(url: string, key: string) {
    return this.dataService.getNasaGallery(url).pipe(
      map((responseData) => {
        // if length of the response is 0 return an empty array
        if (responseData.collection.items.length === 0) {
          return [];
        }

        const data = responseData.collection.items;

        // find and assign the url of the next prompt
        const nextUrlRetrieved = responseData.collection.links.find(
          (x) => x.prompt === 'Next'
        )?.href;

        // set the data in the cache
        this.cacheService.set(PAGE_KEYS.NASA_GALLERY, key, data);

        return data;
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);
        this.router.navigate([ROUTES.error], {
          state: { returnUrl: ROUTES.nasaGallery },
        });

        return [];
      })
    );
  }
}
