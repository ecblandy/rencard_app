import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePartner } from './create-partner';

describe('CreatePartner', () => {
  let component: CreatePartner;
  let fixture: ComponentFixture<CreatePartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePartner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePartner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
