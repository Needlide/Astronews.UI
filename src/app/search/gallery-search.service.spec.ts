import { TestBed } from '@angular/core/testing';

import { GallerySearchService } from './gallery-search.service';

describe('GallerySearchService', () => {
  let service: GallerySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GallerySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
