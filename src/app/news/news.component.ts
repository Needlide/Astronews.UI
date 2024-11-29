import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../models/news.model';
import { UrlBuilderService } from '../url-builder.service';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { loadNews } from './news.actions';
import { NewsState } from './news.reducer';
import { selectNewsData, selectNewsLoading, selectNewsError } from './news.selectors';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  data$: Observable<NewsModel[]> = this.store.pipe(select(selectNewsData)) ?? of([]);
  isLoading$: Observable<boolean> = this.store.pipe(select(selectNewsLoading));
  error$: Observable<string | null> = this.store.pipe(select(selectNewsError));
  noData = []

  constructor(
    private store: Store<NewsState>,
    private urlBuilder: UrlBuilderService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    const url = this.urlBuilder.getNewsUrl();
    const cacheKeyword = "default_key";
    this.store.dispatch(loadNews({ url: url, cacheKey: cacheKeyword}));
  }
}
