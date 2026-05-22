import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQrcode } from './dashboard-qrcode';

describe('DashboardQrcode', () => {
  let component: DashboardQrcode;
  let fixture: ComponentFixture<DashboardQrcode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardQrcode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardQrcode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
