import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponDetails } from './coupon-details';

describe('CouponDetails', () => {
  let component: CouponDetails;
  let fixture: ComponentFixture<CouponDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
