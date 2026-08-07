import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalMap } from './profesional-map';

describe('ProfesionalMap', () => {
  let component: ProfesionalMap;
  let fixture: ComponentFixture<ProfesionalMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalMap],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesionalMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
