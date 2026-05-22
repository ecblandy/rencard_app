import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersActiveGraph } from './users-active-graph';

describe('UsersActiveGraph', () => {
  let component: UsersActiveGraph;
  let fixture: ComponentFixture<UsersActiveGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersActiveGraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersActiveGraph);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
