import { Component, OnInit } from '@angular/core';
import { Data } from '../models/gallery/gallery.root.model';
import { UrlBuilderService } from '../url-builder.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectNasaGalleryData,
  selectNasaGalleryError,
  selectNasaGalleryIsLoading,
} from './nasa-gallery.selectors';
import { NasaGalleryState } from './nasa-gallery.reducer';
import { NasaGalleryActions } from './nasa-gallery.actions';
import { DEFAULT_CACHE_KEYS } from '../cache/cache-keys';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-nasa-gallery',
  templateUrl: './nasa-gallery.component.html',
  styleUrls: ['./nasa-gallery.component.scss'],
})
export class NasaGalleryComponent implements OnInit {
  data$: Observable<Data[]> = this.store.select(selectNasaGalleryData);
  isLoading$: Observable<boolean> = this.store.select(
    selectNasaGalleryIsLoading
  );
  error$: Observable<string | null> = this.store.select(selectNasaGalleryError);

  constructor(
    private store: Store<NasaGalleryState>,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe((searchText) => {
      this.store.dispatch(
        NasaGalleryActions.loadData({ searchTerm: searchText })
      );
    });
  }
}
