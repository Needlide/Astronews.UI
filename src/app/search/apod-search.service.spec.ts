import { TestBed } from '@angular/core/testing';

import { ApodSearchService } from './apod-search.service';

describe('ApodSearchService', () => {
  let service: ApodSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApodSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
