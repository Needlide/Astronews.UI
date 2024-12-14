import { Component, numberAttribute, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { Data } from '../models/gallery/gallery.root.model';
import { PromptService } from '../shared/prompt.service';
import { SearchService } from '../search/search.service';
import { parseSearchTerm, parseSearchValue } from '../search/search.util';
import { UrlBuilderService } from '../url-builder.service';
import { CachingService } from '../cache/caching.service';
import { lastValueFrom, Observable } from 'rxjs';
import { GalleryCache } from '../models/cache/gallery-cache.model';
import { errorMessageDataFetch, errorUrlGallery } from '../shared/constants';
import { GalleryModel } from '../models/gallery/gallery.model';
import { Store } from '@ngrx/store';
import {
  selectNasaGalleryData,
  selectNasaGalleryError,
  selectNasaGalleryIsLoading,
} from './nasa-gallery.selectors';
import { NasaGalleryState } from './nasa-gallery.reducer';
import { NasaGalleryActions } from './nasa-gallery.actions';
import { DEFAULT_CACHE_KEYS } from '../cache/cache-keys';

@Component({
  selector: 'app-nasa-gallery',
  templateUrl: './nasa-gallery.component.html',
  styleUrls: ['./nasa-gallery.component.scss'],
})
export class NasaGalleryComponent implements OnInit {
  data$: Observable<GalleryModel[]> = this.store.select(selectNasaGalleryData);
  isLoading$: Observable<boolean> = this.store.select(
    selectNasaGalleryIsLoading
  );
  error$: Observable<string | null> = this.store.select(selectNasaGalleryError);

  constructor(
    private store: Store<NasaGalleryState>,
    private urlBuilder: UrlBuilderService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const url = this.urlBuilder.getGalleryUrl();
    this.store.dispatch(
      NasaGalleryActions.loadData({
        url: url,
        cacheKey: DEFAULT_CACHE_KEYS.NASA_GALLERY,
      })
    );
  }
  /*
  data: Data[] = [];
  private cacheKeyword: string = '';
  isSearchMode: boolean = false;
  isDataAvailable: boolean = false;

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private promptService: PromptService,
    private searchService: SearchService,
    urlBuilder: UrlBuilderService,
    private cacheService: CachingService
  ) {
    this.searchService.searchTerm$.subscribe((term) => {
      if (term && term.length > 2) {
        const { property, value } = parseSearchTerm(term);
        this.isSearchMode = value !== '';

        if (this.isSearchMode && property != null) {
          this.cacheKeyword = term;

          switch (property?.toLowerCase()) {
            case 't':
              let cache_t = this.cacheService.get(this.cacheKeyword);

              if (cache_t) {
                this.data = cache_t.data;
                this.promptService.LibraryNext = cache_t.nextUrl;
              } else {
                let urlT = urlBuilder.getGalleryUrl(
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

                this.clearApiCall(urlT, this.cacheKeyword);
              }
              break;
            case 'd':
              let cache_d = this.cacheService.get(this.cacheKeyword);

              if (cache_d) {
                this.data = cache_d.data;
                this.promptService.LibraryNext = cache_d.nextUrl;
              } else {
                let urlD = urlBuilder.getGalleryUrl(
                  undefined,
                  undefined,
                  undefined,
                  value
                );

                this.clearApiCall(urlD, this.cacheKeyword);
              }
              break;
            case 'c':
              let cache_c = this.cacheService.get(this.cacheKeyword);

              if (cache_c) {
                this.data = cache_c.data;
                this.promptService.LibraryNext = cache_c.nextUrl;
              } else {
                let urlC = urlBuilder.getGalleryUrl(
                  undefined,
                  undefined,
                  value
                );

                this.clearApiCall(urlC, this.cacheKeyword);
              }
              break;
            case 'dc':
              let cache_dc = this.cacheService.get(this.cacheKeyword);

              if (cache_dc) {
                this.data = cache_dc.data;
                this.promptService.LibraryNext = cache_dc.nextUrl;
              } else {
                let urlDC = urlBuilder.getGalleryUrl(
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

                this.clearApiCall(urlDC, this.cacheKeyword);
              }
              break;
            case 'k':
              let cache_k = this.cacheService.get(this.cacheKeyword);

              if (cache_k) {
                this.data = cache_k.data;
                this.promptService.LibraryNext = cache_k.nextUrl;
              } else {
                let urlK = urlBuilder.getGalleryUrl(
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  parseSearchValue(value)
                );

                this.clearApiCall(urlK, this.cacheKeyword);
              }
              break;
            case 'ni':
              let cache_p = this.cacheService.get(this.cacheKeyword);

              if (cache_p) {
                this.data = cache_p.data;
                this.promptService.LibraryNext = cache_p.nextUrl;
              } else {
                let urlP = urlBuilder.getGalleryUrl(
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  value
                );

                this.clearApiCall(urlP, this.cacheKeyword);
              }
              break;
          }
        } else if (this.isSearchMode) {
          this.cacheKeyword = value;
          let cache = cacheService.get(value);

          if (cache) {
            this.data = cache.data;
            this.promptService.LibraryNext = cache.nextUrl;
          } else {
            let url = urlBuilder.getGalleryUrl(undefined, value);
            this.clearApiCall(url, value);
          }
        }
      } else {
        let urlEmpty = urlBuilder.getGalleryUrl();
        this.cacheKeyword = urlEmpty;
        let cache = cacheService.get(this.cacheKeyword);

        if (cache) {
          this.data = cache.data;
          this.promptService.LibraryNext = cache.nextUrl;
        } else {
          this.clearApiCall(urlEmpty, this.cacheKeyword);
        }
      }
    });
  }

  async onScrollDown() {
    if (!this.isSearchMode) {
      await this.apiCall(this.promptService.LibraryNext, this.cacheKeyword);
    }
  }

  private async apiCall(url: string, key: string) {
    if (!url) {
      this.isDataAvailable = false;
      return;
    }
    try {
      const responseData = await lastValueFrom(
        this.apiCaller.getNasaGallery(url)
      );

      if (responseData.collection.items.length == 0) {
        return;
      }

      let nextUrl = responseData.collection.links.find(
        (x) => x.prompt == 'Next'
      )?.href;

      if (nextUrl) {
        if (nextUrl != url) {
          this.data = [...this.data, ...responseData.collection.items];
          this.promptService.LibraryNext = nextUrl;
          let galleryCache: GalleryCache;
          galleryCache = { nextUrl: nextUrl, data: this.data };
          this.cacheService.set(key, galleryCache);
          this.isDataAvailable = true;
        }
      } else {
        this.isDataAvailable = false;
      }
    } catch (error) {
      this.errorService.sendError(errorMessageDataFetch);
      this.router.navigate(['/Error'], {
        state: { returnUrl: errorUrlGallery },
      });
    }
  }

  private async clearApiCall(url: string, key: string) {
    try {
      const responseData = await lastValueFrom(
        this.apiCaller.getNasaGallery(url)
      );

      if (responseData.collection.items.length == 0) {
        return;
      }

      this.data = responseData.collection.items;

      let nextUrlRetrieved = responseData.collection.links.find(
        (x) => x.prompt == 'Next'
      )?.href;

      let galleryCache = {} as GalleryCache;

      galleryCache.data = responseData.collection.items;

      const nextUrl = nextUrlRetrieved || '';
      galleryCache.nextUrl = nextUrl;
      this.isDataAvailable = !!nextUrl;
      this.promptService.LibraryNext = nextUrl;

      this.cacheService.set(key, galleryCache);
    } catch (error) {
      this.errorService.sendError(
        'Error occured during data fetch. Please, try again shortly.'
      );
      this.router.navigate(['/Error'], {
        state: { returnUrl: this.currentUrl },
      });
    }
  }

  async nextPage() {
    await this.apiCall(this.promptService.LibraryNext, this.cacheKeyword);
  }
  */
}
