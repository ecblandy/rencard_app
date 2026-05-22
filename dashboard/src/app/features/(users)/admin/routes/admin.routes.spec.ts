import { TestBed } from '@angular/core/testing';

import { AdminRoutes } from './admin.routes';

describe('AdminRoutes', () => {
  let service: AdminRoutes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRoutes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
