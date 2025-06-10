import { TestBed } from '@angular/core/testing';

import { CachingNewsService } from './caching-news.service';

describe('CachingNewsService', () => {
  let service: CachingNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachingNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
