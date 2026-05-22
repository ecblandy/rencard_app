import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAndSubscription } from './users-and-subscription';

describe('UsersAndSubscription', () => {
  let component: UsersAndSubscription;
  let fixture: ComponentFixture<UsersAndSubscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersAndSubscription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersAndSubscription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
