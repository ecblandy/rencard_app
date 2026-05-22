import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAxisChart } from './multi-axis-chart';

describe('MultiAxisChart', () => {
  let component: MultiAxisChart;
  let fixture: ComponentFixture<MultiAxisChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiAxisChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiAxisChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
