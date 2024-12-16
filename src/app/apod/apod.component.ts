import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod/apod.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { subtractMonthFromDate } from '../shared/date-functions';
import { Store } from '@ngrx/store';
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
}
