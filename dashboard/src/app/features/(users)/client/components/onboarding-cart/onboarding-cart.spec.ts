import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingCart } from './onboarding-cart';

describe('OnboardingCart', () => {
  let component: OnboardingCart;
  let fixture: ComponentFixture<OnboardingCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
