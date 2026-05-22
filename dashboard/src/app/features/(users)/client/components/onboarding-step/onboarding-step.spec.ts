import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingStep } from './onboarding-step';

describe('OnboardingStep', () => {
  let component: OnboardingStep;
  let fixture: ComponentFixture<OnboardingStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
