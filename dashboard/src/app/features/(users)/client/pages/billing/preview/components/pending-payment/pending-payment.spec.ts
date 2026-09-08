import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPayment } from './pending-payment';

describe('PendingPayment', () => {
  let component: PendingPayment;
  let fixture: ComponentFixture<PendingPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
