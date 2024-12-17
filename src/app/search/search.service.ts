import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { searchPause } from '../shared/constants';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _searchTerm = new BehaviorSubject<string>('');
  searchTerm$ = this._searchTerm.asObservable().pipe(debounceTime(searchPause));
  constructor() {}

  setSearchTerm(term: string) {
    this._searchTerm.next(term);
  }

  getSearchTerm(): string {
    return this._searchTerm.getValue();
  }
}
