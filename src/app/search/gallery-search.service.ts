import { Injectable } from '@angular/core';
import { CachingService } from '../cache/caching.service';
import { SearchService } from './search.service';
import { DataService } from '../data.service';
import {
  errorMessageDataFetch,
  errorUrl,
  errorUrlGallery,
  minSymbolsToTriggerSearch,
} from '../shared/constants';
import { DEFAULT_CACHE_KEYS, PAGE_KEYS } from '../cache/cache-keys';
import { parseSearchTerm, parseSearchValue } from './search.util';
import { catchError, map, of } from 'rxjs';
import { GalleryCache } from '../models/cache/gallery-cache.model';
import { PromptService } from '../shared/prompt.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { UrlBuilderService } from '../url-builder.service';

@Injectable({
  providedIn: 'root',
})
export class GallerySearchService {
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
          return of([]);
        }

        const data = responseData.collection.items;

        // find and assign the url of the next prompt
        const nextUrlRetrieved = responseData.collection.links.find(
          (x) => x.prompt === 'Next'
        )?.href;

        // create a cache object of the NASA gallery
        const galleryCache = {} as GalleryCache;
        galleryCache.data = data;

        const nextUrl = nextUrlRetrieved || '';
        galleryCache.nextUrl = nextUrl;

        // set the values so the page will know if there is a data available
        this.promptService.isDataAvailable = !!nextUrl;
        this.promptService.LibraryNext = nextUrl;

        // set the data in the cache
        this.cacheService.set(PAGE_KEYS.NASA_GALLERY, key, galleryCache);

        return of(data);
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);
        this.router.navigate([errorUrl], {
          state: { returnUrl: errorUrlGallery },
        });

        return of([]);
      })
    );
  }
}
