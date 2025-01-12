import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod/apod.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map, Observable, skip, switchMap, take } from 'rxjs';
import {
  addDayToDate,
  addMonthToDate,
  subtractDayFromDate,
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
      const today = new Date();
      const { startDate, adjustedEndDate } = this.calculateDateRange(
        today,
        currentPage
      );

      this.store.dispatch(
        ApodActions.loadData({
          startDate,
          endDate: adjustedEndDate,
          pageNumber: currentPage,
        })
      );
    });
  }

  pageChanged(page: number): void {
    const today = new Date();
    const endDate = subtractDayFromDate(today); // Exclude the current day
    const { startDate, adjustedEndDate } = this.calculateDateRange(
      endDate,
      page
    );

    this.store.dispatch(ApodActions.changeCurrentPage({ currentPage: page }));

    this.currentPage$.pipe(take(1)).subscribe(() => {
      this.store.dispatch(
        ApodActions.loadData({
          startDate,
          endDate: adjustedEndDate,
          pageNumber: page,
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

  private calculateDateRange(
    endDate: Date,
    page: number
  ): { startDate: Date; adjustedEndDate: Date } {
    let adjustedEndDate = new Date(endDate);

    for (let i = 1; i < page; i++) {
      adjustedEndDate = subtractMonthFromDate(adjustedEndDate);
    }

    // First day of the month
    const startDate = new Date(
      adjustedEndDate.getFullYear(),
      adjustedEndDate.getMonth(),
      1
    );

    // Check to not add the month to the current date
    if (page !== 1) {
      // Last day of the month
      adjustedEndDate = new Date(
        adjustedEndDate.getFullYear(),
        adjustedEndDate.getMonth() + 1,
        0
      );
    }

    // Check so dates don't exceed the start date of APOD
    if (startDate < firstDateForApod) {
      return {
        startDate: new Date(firstDateForApod),
        adjustedEndDate: new Date(
          firstDateForApod.getFullYear(),
          firstDateForApod.getMonth() + 1,
          0
        ),
      };
    }

    return { startDate, adjustedEndDate };
  }
}
