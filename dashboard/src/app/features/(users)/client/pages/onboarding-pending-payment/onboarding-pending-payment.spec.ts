import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingPendingPayment } from './onboarding-pending-payment';

describe('OnboardingPendingPayment', () => {
  let component: OnboardingPendingPayment;
  let fixture: ComponentFixture<OnboardingPendingPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingPendingPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingPendingPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
