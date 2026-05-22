import { TestBed } from '@angular/core/testing';

import { ApiAffiliateTs } from './api-affiliate.js';

describe('ApiAffiliateTs', () => {
  let service: ApiAffiliateTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAffiliateTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
