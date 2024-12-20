import { Component, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars/mars.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MarsCuriosityState } from './mars-photos-curiosity.reducer';
import {
  selectMarsCuriosityData,
  selectMarsCuriosityError,
  selectMarsCuriosityIsLoading,
} from './mars-photos-curiosity.selectors';
import { MarsCuriosityActions } from './mars-photos-curiosity.actions';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos-curiosity.component.html',
  styleUrls: ['./mars-photos-curiosity.component.scss'],
})
export class MarsPhotosCuriosityComponent implements OnInit {
  data$: Observable<MarsModel[]> = this.store.select(selectMarsCuriosityData);
  isLoading$: Observable<boolean> = this.store.select(
    selectMarsCuriosityIsLoading
  );
  error$: Observable<string | null> = this.store.select(
    selectMarsCuriosityError
  );

  constructor(
    private store: Store<MarsCuriosityState>,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe((searchText) => {
      this.store.dispatch(
        MarsCuriosityActions.loadData({ searchTerm: searchText })
      );
    });
  }
}
