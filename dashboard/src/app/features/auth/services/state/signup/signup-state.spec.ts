import { TestBed } from '@angular/core/testing';

import { SignupState } from './signup-state';

describe('SignupState', () => {
  let service: SignupState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignupState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
