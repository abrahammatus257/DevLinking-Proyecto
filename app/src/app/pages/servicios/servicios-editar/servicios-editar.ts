import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { Servicio, ServicioUpdateDto } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicios-editar',
  standalone: true,
  imports: [ServicioForm],
  template: `
    <app-servicio-form
      [servicio]="servicio()"
      [saving]="saving()"
      (guardar)="guardar($event)"
      (cancelar)="cancelar()">
    </app-servicio-form>
  `,
})
export class ServiciosEditar implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly servicioService = inject(ServicioService);

  saving = signal(false);
  servicio = signal<Servicio | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.servicioService.obtenerPorId(id).subscribe({
      next: (response) => this.servicio.set(response.data),
      error: (err) => console.error(err)
    });
  }

  guardar(data: ServicioUpdateDto): void {
    const id = this.servicio()?.id;
    if (!id) return;

    this.saving.set(true);
    this.servicioService.actualizar(id, data).subscribe({
      next: () => this.router.navigate(['/servicios', id]),
      error: (err) => { console.error(err); this.saving.set(false); },
      complete: () => this.saving.set(false)
    });
  }

  cancelar(): void {
    const id = this.servicio()?.id;
    this.router.navigate(['/servicios', id]);
  }
}