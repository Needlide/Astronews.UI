import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod/apod.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SearchService } from '../search/search.service';
import { parseSearchTerm } from '../search/search.util';
import { CachingService } from '../cache/caching.service';
import { lastValueFrom, Observable, of } from 'rxjs';
import {
  convertDateToString,
  subtractMonthFromDate,
} from '../shared/date-functions';
import { select, Store } from '@ngrx/store';
import { ApodState } from './apod.reducer';
import {
  selectApodData,
  selectApodError,
  selectApodLoading,
} from './apod.selectors';
import { ApodActions } from './apod.actions';
import { DEFAULT_CACHE_KEYS } from '../cache/cache-keys';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss'],
})
export class APODComponent implements OnInit {
  data$: Observable<ApodModel[]> = this.store.select(selectApodData) ?? of([]);
  isLoading$: Observable<boolean> = this.store.select(selectApodLoading);
  error$: Observable<string | null> = this.store.select(selectApodError);

  constructor(
    private store: Store<ApodState>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    let endDate = new Date();
    let startDate = subtractMonthFromDate(endDate);
    this.store.dispatch(
      ApodActions.loadData({
        startDate: startDate,
        endDate: endDate,
        cacheKey: DEFAULT_CACHE_KEYS.APOD,
      })
    );
  }

  isYouTubeLink(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  /*
  data: ApodModel[] = [];
  date: Date;
  isDataUpdated: boolean = false;
  private readonly CacheKeyword: string = 'APOD_DEFAULT';
  isSearchMode: boolean = false;
  private readonly currentUrl: string = '/APOD';

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private searchService: SearchService,
    private cacheService: CachingService
  ) {
    this.date = new Date();
    this.searchService.searchTerm$.subscribe((term) => this.filterData(term));
  }

  private filterData(term: string): void {
    if (term && term.length > 2) {
      const { property, value } = parseSearchTerm(term);
      this.isSearchMode = value !== '';

      if (this.isSearchMode && property != null) {
        switch (property?.toLowerCase()) {
          case 't':
            let cache_t = this.cacheService.get(term);

            if (cache_t && !this.isDataUpdated) {
              this.data = cache_t;
            } else {
              this.data = this.cacheService
                .get(this.CacheKeyword)
                .filter((item: ApodModel) =>
                  item.title.toLowerCase().includes(value.toLowerCase())
                );
              this.cacheService.set(term, this.data);
              this.isDataUpdated = false;
            }
            break;
          case 'e':
            let cache_e = this.cacheService.get(term);

            if (cache_e && !this.isDataUpdated) {
              this.data = cache_e;
            } else {
              this.data = this.cacheService
                .get(this.CacheKeyword)
                .filter((item: ApodModel) =>
                  item.explanation.toLowerCase().includes(value.toLowerCase())
                );
              this.cacheService.set(term, this.data);
              this.isDataUpdated = false;
            }
            break;
          case 'c':
            let cache_c = this.cacheService.get(term);

            if (cache_c && !this.isDataUpdated) {
              this.data = cache_c;
            } else {
              this.data = this.cacheService
                .get(this.CacheKeyword)
                .filter((item: ApodModel) =>
                  item.copyright.toLowerCase().includes(value.toLowerCase())
                );
              this.cacheService.set(term, this.data);
              this.isDataUpdated = false;
            }
            break;
          case 'd':
            let cache_d = this.cacheService.get(term);

            if (cache_d && !this.isDataUpdated) {
              this.data = cache_d;
            } else {
              this.data = this.cacheService
                .get(this.CacheKeyword)
                .filter((item: ApodModel) => item.date.includes(value));
              this.cacheService.set(term, this.data);
              this.isDataUpdated = false;
            }
            break;
          default:
            this.data = this.cacheService.get(this.CacheKeyword);
            break;
        }
      } else if (this.isSearchMode) {
        let cache = this.cacheService.get(value);

        if (cache) {
          this.data = cache;
        } else {
          this.data = this.cacheService
            .get(this.CacheKeyword)
            .filter(
              (item: ApodModel) =>
                item.title.includes(value) || item.explanation.includes(value)
            );
          this.cacheService.set(value, this.data);
        }
      }
    } else {
      let cache = this.cacheService.get(this.CacheKeyword);

      if (cache) {
        this.data = cache;
      } else {
        if (!this.isDataUpdated) {
          this.defaultCallApi();
        }
      }
    }
  }

  async onScrollDown(): Promise<void> {
    this.date.setDate(this.date.getDate() - 1);
    let yearEnd = this.convertDateToString(this.date);
    this.date.setMonth(this.date.getMonth() - 1);
    let yearStart = this.convertDateToString(this.date);
    await this.apiCall(yearStart, yearEnd);
    this.filterData(this.searchService.getSearchTerm());
  }

  private async apiCall(yearStart: string, yearEnd: string): Promise<void> {
    try {
      const responseData$ = this.apiCaller.getApods(yearStart, yearEnd);
      const responseData = await lastValueFrom(responseData$);

      if (responseData.length == 0) {
        return;
      }

      let cache = this.cacheService.get(this.CacheKeyword);

      if (cache) {
        cache = [...cache, ...responseData];
        this.cacheService.set(this.CacheKeyword, cache);
      } else {
        this.cacheService.set(this.CacheKeyword, responseData);
      }

      let searchTerm = this.searchService.getSearchTerm();

      if (searchTerm) {
        this.filterData(searchTerm);
      } else {
        this.data = responseData;
      }

      this.isDataUpdated = true;
    } catch (error) {
      this.errorService.sendError(
        'Error occurred during fetching the data. Please, try again shortly.'
      );
      this.router.navigate(['/Error'], {
        state: { returnUrl: this.currentUrl },
      });
    }
  }

  isYouTubeLink(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private defaultCallApi(): void {
    let date_default = new Date();

    let dateEnd = convertDateToString(date_default);

    date_default.setMonth(this.date.getMonth() - 1);
    let dateStart = convertDateToString(date_default);

    this.apiCall(dateStart, dateEnd);
  }*/
}
