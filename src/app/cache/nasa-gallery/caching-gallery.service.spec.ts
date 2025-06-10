import { TestBed } from '@angular/core/testing';

import { CachingGalleryService } from './caching-gallery.service';

describe('CachingGalleryService', () => {
  let service: CachingGalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachingGalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
