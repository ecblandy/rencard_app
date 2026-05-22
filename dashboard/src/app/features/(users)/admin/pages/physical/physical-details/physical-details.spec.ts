import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalDetails } from './physical-details';

describe('PhysicalDetails', () => {
  let component: PhysicalDetails;
  let fixture: ComponentFixture<PhysicalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
