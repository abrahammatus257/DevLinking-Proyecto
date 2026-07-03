import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasDetalle } from './citas-detalle';

describe('CitasDetalle', () => {
  let component: CitasDetalle;
  let fixture: ComponentFixture<CitasDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(CitasDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
