import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsModel } from '../models/news/news.model';
import { Store } from '@ngrx/store';
import { Observable, skip, Subscription, take } from 'rxjs';
import { NewsActions } from './news.actions';
import { NewsState } from './news.reducer';
import {
  selectNewsData,
  selectNewsLoading,
  selectNewsError,
  selectNewsPage,
  selectNewsTotalItems,
  selectNewsItemsPerPage,
  selectNewsTotalSearchItems,
  selectNewsIsSearchState,
  selectNewsSearchQuery,
  selectNewsSearchPage,
  selectNewsSearchItemsPerPage,
} from './news.selectors';
import { SearchService } from '../search/search.service';
import { minSymbolsToTriggerSearch } from '../shared/constants';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  data$: Observable<NewsModel[]> = this.store.select(selectNewsData);
  isLoading$: Observable<boolean> = this.store.select(selectNewsLoading);
  error$: Observable<string | null> = this.store.select(selectNewsError);
  currentPage$: Observable<number> = this.store.select(selectNewsPage);
  currentSearchPage$: Observable<number> =
    this.store.select(selectNewsSearchPage);
  totalItems$: Observable<number> = this.store.select(selectNewsTotalItems);
  totalSearchItems$: Observable<number> = this.store.select(
    selectNewsTotalSearchItems
  );
  itemsPerPage$: Observable<number> = this.store.select(selectNewsItemsPerPage);
  searchItemsPerPage$: Observable<number> = this.store.select(
    selectNewsSearchItemsPerPage
  );
  isSearchState$: Observable<boolean> = this.store.select(
    selectNewsIsSearchState
  );
  searchTerm$: Observable<string> = this.store.select(selectNewsSearchQuery);

  private _subscriptions: Subscription[] = [];

  isSearchState: boolean = false;
  error: string | null = null;
  isLoading: boolean = false;
  currentSearchPage: number = 1;
  currentPage: number = 1;
  totalSearchItems: number = 0;
  totalItems: number = 0;
  searchItemsPerPage: number = 0;
  itemsPerPage: number = 0;

  constructor(
    private store: Store<NewsState>,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.setupSubscriptions();
    this.loadData();
    this.trackSearchTerm();
  }

  private setupSubscriptions(): void {
    const searchStateSub = this.isSearchState$.subscribe((searchState) => {
      this.isSearchState = searchState;
    });

    const loadingSub = this.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    const errorSub = this.error$.subscribe((error) => {
      this.error = error;
    });

    const searchSub = this.searchService.searchTerm$.subscribe((searchText) => {
      if (searchText && searchText.length > minSymbolsToTriggerSearch) {
        this.store.dispatch(
          NewsActions.setSearchQuery({ searchTerm: searchText })
        );
      } else if (searchText === '') {
        this.store.dispatch(NewsActions.setSearchQuery({ searchTerm: '' }));
      }
    });

    const searchPageSub = this.currentSearchPage$.subscribe((currentPage) => {
      this.currentSearchPage = currentPage;
    });

    const currentPageSub = this.currentPage$.subscribe((currentPage) => {
      this.currentPage = currentPage;
    });

    const totalSearchItemsSub = this.totalSearchItems$.subscribe(
      (totalItems) => {
        this.totalSearchItems = totalItems;
      }
    );

    const totalItemsSub = this.totalItems$.subscribe((totalItems) => {
      this.totalItems = totalItems;
    });

    const searchItemsPerPageSub = this.searchItemsPerPage$.subscribe(
      (itemsPerPage) => {
        this.searchItemsPerPage = itemsPerPage;
      }
    );

    const itemsPerPageSub = this.itemsPerPage$.subscribe((itemsPerPage) => {
      this.itemsPerPage = itemsPerPage;
    });

    this._subscriptions.push(
      searchStateSub,
      loadingSub,
      errorSub,
      searchSub,
      searchPageSub,
      currentPageSub,
      totalSearchItemsSub,
      totalItemsSub,
      searchItemsPerPageSub,
      itemsPerPageSub
    );
  }

  private loadData(): void {
    this.store.dispatch(NewsActions.loadData());
  }

  private trackSearchTerm(): void {
    const searchTermSub = this.searchTerm$
      .pipe(skip(1))
      .subscribe((searchText) => {
        if (searchText && searchText.length > minSymbolsToTriggerSearch) {
          this.store.dispatch(NewsActions.initiateSearch());
        } else if (searchText === '') {
          this.store.dispatch(NewsActions.loadData());
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
    this.store.dispatch(NewsActions.setPage({ currentPage: page }));
  }

  private searchPageChanged(page: number): void {
    this.store.dispatch(NewsActions.setSearchPage({ searchPage: page }));
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
        this.store.dispatch(NewsActions.setItemsPerPage({ itemsPerPage }));
      }
    });
  }

  private searchItemsPerPageChanged(itemsPerPage: number): void {
    this.searchItemsPerPage$.pipe(take(1)).subscribe((itemsPerPageOld) => {
      if (itemsPerPage !== itemsPerPageOld) {
        this.store.dispatch(
          NewsActions.setSearchItemsPerPage({
            searchItemsPerPage: itemsPerPage,
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
