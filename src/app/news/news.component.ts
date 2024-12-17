import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../models/news/news.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NewsActions } from './news.actions';
import { NewsState } from './news.reducer';
import {
  selectNewsData,
  selectNewsLoading,
  selectNewsError,
} from './news.selectors';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  data$: Observable<NewsModel[]> = this.store.select(selectNewsData);
  isLoading$: Observable<boolean> = this.store.select(selectNewsLoading);
  error$: Observable<string | null> = this.store.select(selectNewsError);

  constructor(
    private store: Store<NewsState>,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe((searchText) => {
      this.store.dispatch(NewsActions.loadData({ searchTerm: searchText }));
    });
  }
}
