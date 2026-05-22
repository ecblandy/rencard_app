import { TestBed } from '@angular/core/testing';
import { PaymentApi } from './payment.api';

describe('ApiServices', () => {
  let service: PaymentApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
