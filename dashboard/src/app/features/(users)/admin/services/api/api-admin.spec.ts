import { TestBed } from '@angular/core/testing';

import { ApiAdmin } from './api-admin';

describe('ApiAdmin', () => {
  let service: ApiAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAdmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
