import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Physical } from './physical';

describe('Physical', () => {
  let component: Physical;
  let fixture: ComponentFixture<Physical>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Physical]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Physical);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
