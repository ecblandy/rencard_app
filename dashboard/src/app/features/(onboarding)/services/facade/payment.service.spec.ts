import { PlanService } from './payment.service';
import { TestBed } from '@angular/core/testing';

describe('Plan', () => {
  let service: PlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
