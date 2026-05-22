import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAndSubscriptionCard } from './user-and-subscription-card';

describe('UserAndSubscriptionCard', () => {
  let component: UserAndSubscriptionCard;
  let fixture: ComponentFixture<UserAndSubscriptionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAndSubscriptionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAndSubscriptionCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
