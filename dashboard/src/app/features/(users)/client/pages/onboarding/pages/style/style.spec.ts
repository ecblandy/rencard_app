import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Style } from './style';

describe('Style', () => {
  let component: Style;
  let fixture: ComponentFixture<Style>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Style]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Style);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
