import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { UrlBuilderService } from '../url-builder.service';
import { errorMessageDataFetch } from '../shared/constants';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { parseSearchTerm, parseSearchValue } from './search.util';
import { ErrorService } from '../error.service';
import { convertDateToString, isISO8601Date } from '../shared/date-functions';
import { NewsModel } from '../models/news/news.model';
import { Store } from '@ngrx/store';
import { CachingNewsService } from '../cache/news/caching-news.service';
import { NewsActions } from '../news/news.actions';

@Injectable({
  providedIn: 'root',
})
export class NewsSearchService {
  constructor(
    private cacheService: CachingNewsService,
    private dataService: DataService,
    private errorService: ErrorService,
    private urlBuilder: UrlBuilderService,
    private store: Store
  ) {}

  load(pageNumber: number, itemsPerPage: number): Observable<NewsModel[]> {
    const cache = this.loadPageFromCache(pageNumber);

    if (cache) {
      return of(cache);
    }

    const offset = (pageNumber - 1) * itemsPerPage;

    const requestUrl = this.urlBuilder.getNewsUrl(itemsPerPage, offset);

    return this.apiCall(requestUrl, false).pipe(
      take(1),
      tap((news) => this.cacheService.setPagination(pageNumber, news))
    );
  }

  search(
    searchTerm: string,
    cacheKey: string,
    pageNumber: number,
    itemsPerPage: number
  ): Observable<NewsModel[]> {
    let cache = this.loadSearchPageFromCache(pageNumber, searchTerm);

    if (cache) {
      return of(cache);
    }

    const offset = (pageNumber - 1) * itemsPerPage;

    return this.searchLogic(searchTerm, itemsPerPage, offset).pipe(
      take(1),
      tap((searchedNews) =>
        this.cacheService.setSearch(cacheKey, searchedNews, pageNumber)
      )
    );
  }

  private loadPageFromCache(pageNumber: number): NewsModel[] | null {
    let cache = this.cacheService.getPagination(pageNumber);

    return cache;
  }

  private loadSearchPageFromCache(
    pageNumber: number,
    searchQuery: string
  ): NewsModel[] | null {
    let cache = this.cacheService.getSearch(searchQuery, pageNumber);

    return cache;
  }

  private searchLogic(
    searchTerm: string,
    itemsPerPage: number,
    offset: number
  ) {
    const { property, value } = parseSearchTerm(searchTerm);

    switch (property?.toLowerCase()) {
      case 't':
        let urlT = this.urlBuilder.getNewsUrl(
          itemsPerPage,
          offset,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          parseSearchValue(value)
        );

        return this.apiCall(urlT, true);
      case 'ns':
        let urlNs = this.urlBuilder.getNewsUrl(
          itemsPerPage,
          offset,
          parseSearchValue(value)
        );
        return this.apiCall(urlNs, true);
      case 's':
        let urlS = this.urlBuilder.getNewsUrl(
          itemsPerPage,
          offset,
          undefined,
          undefined,
          undefined,
          undefined,
          parseSearchValue(value)
        );
        return this.apiCall(urlS, true);
      case 'p':
        let dates = parseSearchValue(value);
        if (
          dates.length == 2 &&
          isISO8601Date(dates[0]) &&
          isISO8601Date(dates[1])
        ) {
          let firstDate = new Date(dates[0]);
          let secondDate = new Date(dates[1]);

          if (firstDate < secondDate) {
            let urlP = this.urlBuilder.getNewsUrl(
              itemsPerPage,
              offset,
              undefined,
              convertDateToString(firstDate),
              convertDateToString(secondDate)
            );
            return this.apiCall(urlP, true);
          } else {
            let urlP = this.urlBuilder.getNewsUrl(
              itemsPerPage,
              offset,
              undefined,
              convertDateToString(firstDate),
              convertDateToString(secondDate)
            );
            return this.apiCall(urlP, true);
          }
        }
        return of([] as NewsModel[]);
      case 'pb':
        let urlPb = this.urlBuilder.getNewsUrl(
          itemsPerPage,
          offset,
          undefined,
          undefined,
          value
        );

        return this.apiCall(urlPb, true);
      case 'pa':
        let urlPa = this.urlBuilder.getNewsUrl(
          itemsPerPage,
          offset,
          undefined,
          value
        );
        return this.apiCall(urlPa, true);
      default:
        let urlSearchDefault = this.urlBuilder.getNewsUrl(
          itemsPerPage,
          offset,
          undefined,
          undefined,
          undefined,
          value
        );
        return this.apiCall(urlSearchDefault, true);
    }
  }

  private apiCall(url: string, isSearch: boolean): Observable<NewsModel[]> {
    return this.dataService.getNews(url).pipe(
      map((responseData) => {
        if (responseData.count == 0) {
          return [];
        }

        if (isSearch) {
          this.store.dispatch(
            NewsActions.setTotalSearchItems({
              totalSearchItems: responseData.count,
            })
          );
        } else {
          this.store.dispatch(
            NewsActions.setTotalItems({ totalItems: responseData.count })
          );
        }

        return responseData.results;
      }),
      catchError(() => {
        this.errorService.sendError(errorMessageDataFetch);

        return [];
      })
    );
  }
}
