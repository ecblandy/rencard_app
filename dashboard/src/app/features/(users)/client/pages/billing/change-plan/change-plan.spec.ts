import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePlan } from './change-plan';

describe('ChangePlan', () => {
  let component: ChangePlan;
  let fixture: ComponentFixture<ChangePlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
