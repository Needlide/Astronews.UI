import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { errorMessageDataFetch } from '../shared/constants';
import { parseSearchTerm, parseSearchValue } from './search.util';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { ErrorService } from '../error.service';
import { UrlBuilderService } from '../url-builder.service';
import { Collection } from '../models/gallery/gallery.root.model';
import { CachingGalleryService } from '../cache/nasa-gallery/caching-gallery.service';
import { GalleryCache } from '../models/cache/gallery-cache.model';

@Injectable({
  providedIn: 'root',
})
export class GallerySearchService {
  constructor(
    private cacheService: CachingGalleryService,
    private dataService: DataService,
    private errorService: ErrorService,
    private urlBuilder: UrlBuilderService
  ) {}

  load(pageNumber: number, itemsPerPage: number): Observable<GalleryCache> {
    const cache = this.loadPageFromCache(pageNumber);

    if (cache) return of(cache);

    const requestUrl = this.urlBuilder.getGalleryUrl(itemsPerPage, pageNumber);

    return this.apiCall(requestUrl).pipe(
      take(1),
      tap((data) =>
        this.cacheService.setPagination(
          pageNumber,
          data.items,
          data.metadata.total_hits
        )
      ),
      map((data) => {
        return {
          data: data.items,
          expiry: 0,
          totalItems: data.metadata.total_hits,
        } as GalleryCache;
      })
    );
  }

  search(
    searchTerm: string,
    cacheKey: string,
    pageNumber: number,
    itemsPerPage: number
  ): Observable<GalleryCache> {
    let cache = this.loadSearchPageFromCache(pageNumber, cacheKey);

    if (cache) return of(cache);

    return this.searchLogic(searchTerm, itemsPerPage, pageNumber).pipe(
      take(1),
      tap((data) =>
        this.cacheService.setSearch(
          cacheKey,
          data.items,
          data.metadata.total_hits,
          pageNumber
        )
      ),
      map((data) => {
        return {
          data: data.items,
          expiry: 0,
          totalItems: data.metadata.total_hits,
        } as GalleryCache;
      })
    );
  }

  private loadPageFromCache(pageNumber: number): GalleryCache | null {
    let cache = this.cacheService.getPagination(pageNumber);

    return cache;
  }

  private loadSearchPageFromCache(
    pageNumber: number,
    cacheKey: string
  ): GalleryCache | null {
    let cache = this.cacheService.getSearch(cacheKey, pageNumber);

    return cache;
  }

  private searchLogic(searchTerm: string, itemsPerPage: number, page: number) {
    const { property, value } = parseSearchTerm(searchTerm);

    switch (property?.toLowerCase()) {
      case 't':
        let urlT = this.urlBuilder.getGalleryUrl(
          itemsPerPage,
          page,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlT);
      case 'd':
        let urlD = this.urlBuilder.getGalleryUrl(
          itemsPerPage,
          page,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlD);
      case 'c':
        let urlC = this.urlBuilder.getGalleryUrl(
          itemsPerPage,
          page,
          undefined,
          value
        );
        return this.apiCall(urlC);
      case 'dc':
        let urlDC = this.urlBuilder.getGalleryUrl(
          itemsPerPage,
          page,
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

        return this.apiCall(urlDC);
      case 'k':
        let urlK = this.urlBuilder.getGalleryUrl(
          itemsPerPage,
          page,
          undefined,
          undefined,
          undefined,
          parseSearchValue(value)
        );

        return this.apiCall(urlK);
      case 'ni':
        let urlP = this.urlBuilder.getGalleryUrl(
          itemsPerPage,
          page,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlP);
      default:
        let urlSearchDefault = this.urlBuilder.getGalleryUrl(
          itemsPerPage,
          page,
          value
        );
        return this.apiCall(urlSearchDefault);
    }
  }

  private apiCall(url: string): Observable<Collection> {
    return this.dataService.getNasaGallery(url).pipe(
      map((responseData) => {
        responseData.collection;
        if (responseData.collection.items.length === 0) {
          return {} as Collection;
        }

        const data = responseData.collection;

        return data;
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);

        return [];
      })
    );
  }
}
