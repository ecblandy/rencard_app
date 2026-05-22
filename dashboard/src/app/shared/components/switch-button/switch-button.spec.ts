import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchButton } from './switch-button';

describe('SwitchButton', () => {
  let component: SwitchButton;
  let fixture: ComponentFixture<SwitchButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
