import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ServiciosEditar } from './servicios-editar';

describe('ServiciosEditar', () => {
  let component: ServiciosEditar;
  let fixture: ComponentFixture<ServiciosEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosEditar],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});