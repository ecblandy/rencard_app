import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionBlocked } from './subscription-blocked';

describe('SubscriptionBlocked', () => {
  let component: SubscriptionBlocked;
  let fixture: ComponentFixture<SubscriptionBlocked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionBlocked]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionBlocked);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
