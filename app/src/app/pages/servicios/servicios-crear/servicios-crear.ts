import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { ServicioCreateDto } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicios-crear',
  standalone: true,
  imports: [ServicioForm],
  template: `
    <app-servicio-form
      [servicio]="null"
      [saving]="saving()"
      (guardar)="guardar($event)"
      (cancelar)="cancelar()">
    </app-servicio-form>
  `,
})
export class ServiciosCrear {
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);

  saving = signal(false);

  guardar(data: any): void {
    this.saving.set(true);
    
    // Casteamos a CreateDto ya que estamos creando
    const dto = data as ServicioCreateDto;

    this.servicioService.crear(dto).subscribe({
      next: (response) => {
        // Redirige al detalle del servicio recién creado o a la lista
        this.router.navigate(['/servicios', response.data.id]);
      },
      error: (err) => {
        console.error('Error al crear el servicio:', err);
        this.saving.set(false);
      },
      complete: () => this.saving.set(false)
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}