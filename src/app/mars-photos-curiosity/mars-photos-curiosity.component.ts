import { Component, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars/mars.model';
import { Rovers } from '../models/mars/rovers';
import { UrlBuilderService } from '../url-builder.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MarsCuriosityState } from './mars-photos-curiosity.reducer';
import {
  selectMarsCuriosityData,
  selectMarsCuriosityError,
  selectMarsCuriosityIsLoading,
  selectMarsCuriosityMaxSol,
} from './mars-photos-curiosity.selectors';
import { MarsCuriosityActions } from './mars-photos-curiosity.actions';
import { DEFAULT_CACHE_KEYS } from '../cache/cache-keys';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos-curiosity.component.html',
  styleUrls: ['./mars-photos-curiosity.component.scss'],
})
export class MarsPhotosCuriosityComponent implements OnInit {
  data$: Observable<MarsModel[]> = this.store.select(selectMarsCuriosityData);
  maxSol$: Observable<number> = this.store.select(selectMarsCuriosityMaxSol);
  isLoading$: Observable<boolean> = this.store.select(
    selectMarsCuriosityIsLoading
  );
  error$: Observable<string | null> = this.store.select(
    selectMarsCuriosityError
  );

  constructor(
    private store: Store<MarsCuriosityState>,
    private urlBuilder: UrlBuilderService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const url = this.urlBuilder.getMarsLatestUrl(Rovers.Curiosity);
    this.store.dispatch(
      MarsCuriosityActions.loadData({
        url: url,
        cacheKey: DEFAULT_CACHE_KEYS.MARS_CURIOSITY,
      })
    );
  }
}
