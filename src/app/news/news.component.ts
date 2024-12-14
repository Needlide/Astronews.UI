import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../models/news/news.model';
import { UrlBuilderService } from '../url-builder.service';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { NewsActions } from './news.actions';
import { NewsState } from './news.reducer';
import {
  selectNewsData,
  selectNewsLoading,
  selectNewsError,
} from './news.selectors';
import { DEFAULT_CACHE_KEYS } from '../cache/cache-keys';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  data$: Observable<NewsModel[]> = this.store.select(selectNewsData) ?? of([]);
  isLoading$: Observable<boolean> = this.store.select(selectNewsLoading);
  error$: Observable<string | null> = this.store.select(selectNewsError);
  noData = [];

  constructor(
    private store: Store<NewsState>,
    private urlBuilder: UrlBuilderService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    const url = this.urlBuilder.getNewsUrl();
    this.store.dispatch(
      NewsActions.loadData({ url: url, cacheKey: DEFAULT_CACHE_KEYS.NEWS })
    );
  }
}
