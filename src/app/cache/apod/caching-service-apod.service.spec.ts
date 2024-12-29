import { TestBed } from '@angular/core/testing';

import { CachingServiceApodService } from './caching-service-apod.service';

describe('CachingServiceApodService', () => {
  let service: CachingServiceApodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachingServiceApodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
