import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfosForm } from './account-infos-form';

describe('AccountInfosForm', () => {
  let component: AccountInfosForm;
  let fixture: ComponentFixture<AccountInfosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountInfosForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountInfosForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
