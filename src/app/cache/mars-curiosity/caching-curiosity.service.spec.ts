import { TestBed } from '@angular/core/testing';

import { CachingCuriosityService } from './caching-curiosity.service';

describe('CachingCuriosityService', () => {
  let service: CachingCuriosityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachingCuriosityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
