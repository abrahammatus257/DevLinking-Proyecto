import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasCrear } from './citas-crear';

describe('CitasCrear', () => {
  let component: CitasCrear;
  let fixture: ComponentFixture<CitasCrear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasCrear],
    }).compileComponents();

    fixture = TestBed.createComponent(CitasCrear);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
