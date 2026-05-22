import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoTab } from './personal-info-tab';

describe('PersonalInfoTab', () => {
  let component: PersonalInfoTab;
  let fixture: ComponentFixture<PersonalInfoTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInfoTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalInfoTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
