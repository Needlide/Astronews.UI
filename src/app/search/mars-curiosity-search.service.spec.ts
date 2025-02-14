import { TestBed } from '@angular/core/testing';

import { MarsCuriositySearchService } from './mars-curiosity-search.service';

describe('MarsCuriositySearchService', () => {
  let service: MarsCuriositySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarsCuriositySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
