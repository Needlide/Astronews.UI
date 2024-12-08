import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CachingService } from '../caching.service';
import { parseSearchTerm } from '../search.util';
import { DataService } from '../data.service';
import { parse } from 'path';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _searchTerm = new BehaviorSubject<string>('');
  searchTerm$ = this._searchTerm.asObservable();

  constructor(
    private cacheService: CachingService,
    private dataService: DataService
  ) {}

  setSearchTerm(term: string) {
    this._searchTerm.next(term);
  }

  getSearchTerm(): string {
    return this._searchTerm.getValue();
  }

  performSearch(page_key: string, data: any[]): any[] {
    let term = this.getSearchTerm();

    // start searching from 3 symbols
    if (!term || term.length < 4) {
      return [];
    }

    // retrieve cache by term key
    let cache = this.cacheService.get(page_key, term);

    if (cache) {
      return cache;
    }
  }
}
