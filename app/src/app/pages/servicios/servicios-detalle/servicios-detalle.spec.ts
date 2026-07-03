import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosDetalle } from './servicios-detalle';

describe('ServiciosDetalle', () => {
  let component: ServiciosDetalle;
  let fixture: ComponentFixture<ServiciosDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
