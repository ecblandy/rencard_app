import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHeader } from './header';

describe('Header', () => {
  let component: UiHeader;
  let fixture: ComponentFixture<UiHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(UiHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
