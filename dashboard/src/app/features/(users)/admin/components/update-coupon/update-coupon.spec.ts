import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCoupon } from './update-coupon';

describe('UpdateCoupon', () => {
  let component: UpdateCoupon;
  let fixture: ComponentFixture<UpdateCoupon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCoupon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCoupon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
