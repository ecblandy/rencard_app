import { TestBed } from '@angular/core/testing';

import { OnboardingServices } from './onboarding.services';

describe('OnboardingServices', () => {
  let service: OnboardingServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardingServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
