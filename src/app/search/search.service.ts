import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _searchTerm = new BehaviorSubject<string>('');
  searchTerm$ = this._searchTerm.asObservable();

  constructor() {}

  setSearchTerm(term: string) {
    this._searchTerm.next(term);
  }

  getSearchTerm(): string {
    return this._searchTerm.getValue();
  }
}
