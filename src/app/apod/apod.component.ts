import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod/apod.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map, Observable, skip, switchMap, take } from 'rxjs';
import {
  addDayToDate,
  addMonthToDate,
  subtractMonthFromDate,
} from '../shared/date-functions';
import { Store } from '@ngrx/store';
import { ApodState } from './apod.reducer';
import {
  selectApodData,
  selectApodError,
  selectApodLoading,
  selectApodPage,
  selectApodPaginationEnabled,
  selectApodTotalItems,
} from './apod.selectors';
import { ApodActions } from './apod.actions';
import { SearchService } from '../search/search.service';
import {
  minSymbolsToTriggerSearch,
  firstDateForApod,
} from '../shared/constants';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss'],
})
export class APODComponent implements OnInit {
  data$: Observable<ApodModel[]> = this.store.select(selectApodData);
  isLoading$: Observable<boolean> = this.store.select(selectApodLoading);
  error$: Observable<string | null> = this.store.select(selectApodError);
  currentPage$: Observable<number> = this.store.select(selectApodPage);
  totalItems$: Observable<number> = this.store.select(selectApodTotalItems);
  paginationEnabled$: Observable<boolean> = this.store.select(
    selectApodPaginationEnabled
  );

  // TODO (switch to second page, search for something successfully, clear search bar) => pagination thinks first page, when actually second

  constructor(
    private store: Store<ApodState>,
    private sanitizer: DomSanitizer,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(ApodActions.calculateTotalItems());

    this.loadData();

    this.searchService.searchTerm$
      .pipe(
        skip(1),
        switchMap((searchText) =>
          this.currentPage$.pipe(
            take(1),
            map((currentPage) => ({ searchText, currentPage }))
          )
        )
      )
      .subscribe(({ searchText, currentPage }) => {
        if (searchText && searchText.length > minSymbolsToTriggerSearch) {
          this.store.dispatch(
            ApodActions.initiateSearch({
              searchTerm: searchText,
              cacheKey: searchText,
              pageNumber: currentPage,
            })
          );
        } else if (!searchText) {
          this.store.dispatch(
            ApodActions.loadPageFromCache({ pageNumber: currentPage })
          );
        }
      });
  }

  private loadData(): void {
    this.currentPage$.pipe(take(1)).subscribe((currentPage) => {
      let endDate = new Date();
      let startDate = subtractMonthFromDate(endDate);

      this.store.dispatch(
        ApodActions.loadData({
          startDate: startDate,
          endDate: endDate,
          pageNumber: currentPage,
        })
      );
    });
  }

  pageChanged(page: number): void {
    let endDate = new Date();
    let startDate = subtractMonthFromDate(endDate);

    for (let i = 0; i < page; i++) {
      endDate = subtractMonthFromDate(endDate);
      startDate = subtractMonthFromDate(startDate);
    }

    if (startDate < firstDateForApod) {
      startDate = new Date(firstDateForApod);
      endDate = addMonthToDate(firstDateForApod);
    }

    this.store.dispatch(ApodActions.changeCurrentPage({ currentPage: page }));

    this.currentPage$.pipe(take(1)).subscribe((currentPage) => {
      this.store.dispatch(
        ApodActions.loadData({
          startDate: addDayToDate(startDate),
          endDate: addDayToDate(endDate),
          pageNumber: currentPage,
        })
      );
    });
  }

  isYouTubeLink(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
