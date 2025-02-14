import { TestBed } from '@angular/core/testing';

import { CachingApodService } from './caching-apod.service';

describe('CachingServiceApodService', () => {
  let service: CachingApodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachingApodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
