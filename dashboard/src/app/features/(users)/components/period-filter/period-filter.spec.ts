import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodFilter } from './period-filter';

describe('PeriodFilter', () => {
  let component: PeriodFilter;
  let fixture: ComponentFixture<PeriodFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
