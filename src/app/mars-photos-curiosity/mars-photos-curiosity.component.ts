import { Component, OnDestroy, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars/mars.model';
import { Observable, skip, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { MarsCuriosityState } from './mars-photos-curiosity.reducer';
import {
  selectMarsCuriosityCurrentSol,
  selectMarsCuriosityData,
  selectMarsCuriosityError,
  selectMarsCuriosityIsLoading,
  selectMarsCuriosityMaxDate,
  selectMarsCuriosityMaxSol,
  selectMarsCuriosityPaginationEnabled,
  selectMarsCuriositySearchQuery,
  selectMarsCuriosityTotalItems,
} from './mars-photos-curiosity.selectors';
import { MarsCuriosityActions } from './mars-photos-curiosity.actions';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos-curiosity.component.html',
  styleUrls: ['./mars-photos-curiosity.component.scss'],
})
export class MarsPhotosCuriosityComponent implements OnInit, OnDestroy {
  data$: Observable<MarsModel[]> = this.store.select(selectMarsCuriosityData);
  isLoading$: Observable<boolean> = this.store.select(
    selectMarsCuriosityIsLoading
  );
  error$: Observable<string | null> = this.store.select(
    selectMarsCuriosityError
  );
  currentSol$: Observable<number> = this.store.select(
    selectMarsCuriosityCurrentSol
  );
  totalItems$: Observable<number> = this.store.select(
    selectMarsCuriosityTotalItems
  );
  searchTerm$: Observable<string> = this.store.select(
    selectMarsCuriositySearchQuery
  );
  maxSol$: Observable<number> = this.store.select(selectMarsCuriosityMaxSol);
  maxDate$: Observable<string> = this.store.select(selectMarsCuriosityMaxDate);
  paginationEnabled$: Observable<boolean> = this.store.select(
    selectMarsCuriosityPaginationEnabled
  );

  private _subscriptions: Subscription[] = [];

  error: string | null = null;
  isLoading: boolean = false;
  currentSol: number = 0;
  maxSol: number = 0;
  maxDate: string = '';
  totalItems: number = 0;
  paginationEnabled: boolean = true;

  constructor(
    private store: Store<MarsCuriosityState>,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadManifest();
    this.setupSubscriptions();
    this.trackSearchTerm();
  }

  private setupSubscriptions(): void {
    const loadingSub = this.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    const errorSub = this.error$.subscribe((error) => {
      this.error = error;
    });

    const searchSub = this.searchService.searchTerm$.subscribe((searchText) => {
      if (searchText) {
        this.store.dispatch(
          MarsCuriosityActions.setSearchQuery({ searchTerm: searchText })
        );
      } else if (searchText === '') {
        this.store.dispatch(
          MarsCuriosityActions.setSearchQuery({ searchTerm: '' })
        );
      }
    });

    const currentSolSub = this.currentSol$.subscribe((currentSol) => {
      this.currentSol = currentSol;
    });

    const totalItemsSub = this.totalItems$.subscribe((totalItems) => {
      this.totalItems = totalItems;
    });

    const maxSolSub = this.maxSol$.subscribe((maxSol) => {
      this.maxSol = maxSol;
    });

    const paginationEnabledSub = this.paginationEnabled$.subscribe(
      (paginationEnabled) => {
        this.paginationEnabled = paginationEnabled;
      }
    );

    this._subscriptions.push(
      loadingSub,
      errorSub,
      searchSub,
      currentSolSub,
      totalItemsSub,
      maxSolSub,
      paginationEnabledSub
    );
  }

  private loadManifest(): void {
    this.store.dispatch(MarsCuriosityActions.loadManifest());
  }

  private trackSearchTerm(): void {
    const searchTermSub = this.searchTerm$
      .pipe(skip(1))
      .subscribe((searchText) => {
        if (searchText) {
          this.store.dispatch(MarsCuriosityActions.initiateSearch());
        } else if (searchText === '') {
          this.store.dispatch(MarsCuriosityActions.loadData());
        }
      });

    this._subscriptions.push(searchTermSub);
  }

  onPageChanged(page: number): void {
    this.store.dispatch(MarsCuriosityActions.setSol({ currentSol: page }));
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
