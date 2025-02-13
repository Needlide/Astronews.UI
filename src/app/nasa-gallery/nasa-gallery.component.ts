import { Component, OnDestroy, OnInit } from '@angular/core';
import { Data } from '../models/gallery/gallery.root.model';
import { Observable, skip, Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectNasaGalleryData,
  selectNasaGalleryError,
  selectNasaGalleryLoading,
  selectNasaGalleryItemsPerPage,
  selectNasaGalleryPage,
  selectNasaGallerySearchQuery,
  selectNasaGalleryTotalItems,
  selectNasaGallerySearchPage,
  selectNasaGalleryTotalSearchItems,
  selectNasaGallerySearchItemsPerPage,
  selectNasaGalleryIsSearchState,
} from './nasa-gallery.selectors';
import { NasaGalleryState } from './nasa-gallery.reducer';
import { NasaGalleryActions } from './nasa-gallery.actions';
import { SearchService } from '../search/search.service';
import { minSymbolsToTriggerSearch } from '../shared/constants';

@Component({
  selector: 'app-nasa-gallery',
  templateUrl: './nasa-gallery.component.html',
  styleUrls: ['./nasa-gallery.component.scss'],
})
export class NasaGalleryComponent implements OnInit, OnDestroy {
  data$: Observable<Data[]> = this.store.select(selectNasaGalleryData);
  isLoading$: Observable<boolean> = this.store.select(selectNasaGalleryLoading);
  error$: Observable<string | null> = this.store.select(selectNasaGalleryError);
  currentPage$: Observable<number> = this.store.select(selectNasaGalleryPage);
  currentSearchPage$: Observable<number> = this.store.select(
    selectNasaGallerySearchPage
  );
  totalItems$: Observable<number> = this.store.select(
    selectNasaGalleryTotalItems
  );
  totalSearchItems$: Observable<number> = this.store.select(
    selectNasaGalleryTotalSearchItems
  );
  itemsPerPage$: Observable<number> = this.store.select(
    selectNasaGalleryItemsPerPage
  );
  searchItemsPerPage$: Observable<number> = this.store.select(
    selectNasaGallerySearchItemsPerPage
  );
  isSearchState$: Observable<boolean> = this.store.select(
    selectNasaGalleryIsSearchState
  );
  searchTerm$: Observable<string> = this.store.select(
    selectNasaGallerySearchQuery
  );

  private _subscriptions: Subscription[] = [];

  isSearchState: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;
  currentPage: number = 1;
  currentSearchPage: number = 1;
  totalItems: number = 0;
  totalSearchItems: number = 0;
  itemsPerPage: number = 0;
  searchItemsPerPage: number = 0;

  constructor(
    private store: Store<NasaGalleryState>,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.setupSubscriptions();
    this.loadData();
    this.trackSearchTerm();
  }

  private setupSubscriptions(): void {
    const searchStateSub = this.isSearchState$.subscribe(
      (searchState) => (this.isSearchState = searchState)
    );

    const loadingSub = this.isLoading$.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    const errorSub = this.error$.subscribe((error) => (this.error = error));

    const searchSub = this.searchService.searchTerm$.subscribe((searchText) => {
      if (searchText && searchText.length > minSymbolsToTriggerSearch) {
        this.store.dispatch(
          NasaGalleryActions.setSearchQuery({
            searchTerm: searchText,
          })
        );
      } else {
        this.store.dispatch(
          NasaGalleryActions.setSearchQuery({ searchTerm: '' })
        );
      }
    });

    const currentPageSub = this.currentPage$.subscribe(
      (currentPage) => (this.currentPage = currentPage)
    );

    const searchPageSub = this.currentSearchPage$.subscribe(
      (currentPage) => (this.currentSearchPage = currentPage)
    );

    const totalItemsSub = this.totalItems$.subscribe((totalItems) => {
      this.totalItems = totalItems;
    });

    const totalSearchItemsSub = this.totalSearchItems$.subscribe(
      (totalItems) => (this.totalSearchItems = totalItems)
    );

    const itemsPerPageSub = this.itemsPerPage$.subscribe(
      (itemsPerPage) => (this.itemsPerPage = itemsPerPage)
    );

    const searchItemsPerPageSub = this.searchItemsPerPage$.subscribe(
      (itemsPerPage) => (this.searchItemsPerPage = itemsPerPage)
    );

    this._subscriptions.push(
      searchStateSub,
      loadingSub,
      errorSub,
      searchSub,
      currentPageSub,
      searchPageSub,
      totalItemsSub,
      totalSearchItemsSub,
      itemsPerPageSub,
      searchItemsPerPageSub
    );
  }

  private loadData(): void {
    this.store.dispatch(NasaGalleryActions.loadData());
  }

  private trackSearchTerm(): void {
    const searchTermSub = this.searchTerm$
      .pipe(skip(1))
      .subscribe((searchText) => {
        if (searchText) {
          this.store.dispatch(NasaGalleryActions.initiateSearch());
        } else if (searchText === '') {
          this.store.dispatch(NasaGalleryActions.loadData());
        }
      });

    this._subscriptions.push(searchTermSub);
  }

  onPageChanged(page: number): void {
    if (this.isSearchState) {
      this.searchPageChanged(page);
    } else {
      this.pageChanged(page);
    }
  }

  private pageChanged(page: number): void {
    this.store.dispatch(NasaGalleryActions.setPage({ currentPage: page }));
  }

  private searchPageChanged(page: number): void {
    this.store.dispatch(NasaGalleryActions.setSearchPage({ searchPage: page }));
  }

  onItemsPerPageChanged(itemsPerPage: number): void {
    if (this.isSearchState) {
      this.searchItemsPerPageChanged(itemsPerPage);
    } else {
      this.itemsPerPageChanged(itemsPerPage);
    }
  }

  private itemsPerPageChanged(itemsPerPage: number): void {
    this.itemsPerPage$.pipe(take(1)).subscribe((itemsPerPageOld) => {
      if (itemsPerPage !== itemsPerPageOld) {
        this.store.dispatch(
          NasaGalleryActions.setItemsPerPage({ itemsPerPage })
        );
      }
    });
  }

  private searchItemsPerPageChanged(itemsPerPage: number): void {
    this.searchItemsPerPage$.pipe(take(1)).subscribe((itemsPerPageOld) => {
      if (itemsPerPage !== itemsPerPageOld) {
        this.store.dispatch(
          NasaGalleryActions.setSearchItemsPerPage({
            searchItemsPerPage: itemsPerPage,
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  } //TODO fix layout in component.html
}
