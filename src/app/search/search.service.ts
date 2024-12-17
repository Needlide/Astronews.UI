import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _searchTerm = new BehaviorSubject<string>('');
  searchTerm$ = this._searchTerm.asObservable();

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(730)).subscribe((searchText) => {
      this._searchTerm.next(searchText);
    });
  }

  setSearchTerm(term: string) {
    this._searchTerm.next(term);
  }

  getSearchTerm(): string {
    return this._searchTerm.getValue();
  }
}
