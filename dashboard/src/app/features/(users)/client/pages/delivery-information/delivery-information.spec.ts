import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInformation } from './delivery-information';

describe('DeliveryInformation', () => {
  let component: DeliveryInformation;
  let fixture: ComponentFixture<DeliveryInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
