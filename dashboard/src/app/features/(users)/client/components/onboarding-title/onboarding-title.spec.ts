import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingTitle } from './onboarding-title';

describe('OnboardingTitle', () => {
  let component: OnboardingTitle;
  let fixture: ComponentFixture<OnboardingTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingTitle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingTitle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
