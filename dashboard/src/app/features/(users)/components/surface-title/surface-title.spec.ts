import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfaceTitle } from './surface-title';

describe('SurfaceTitle', () => {
  let component: SurfaceTitle;
  let fixture: ComponentFixture<SurfaceTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurfaceTitle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurfaceTitle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
