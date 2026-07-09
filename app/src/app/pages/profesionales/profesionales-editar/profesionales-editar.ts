import { Component, inject, signal, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';

import { Profesional, ProfesionalUpdateDto } from '../../../core/models/profesional.model';

import { ProfesionalService } from '../../../core/services/profesional.service';

@Component({
  selector: 'app-profesionales-editar',
  standalone: true,
  imports: [ProfesionalForm],
  templateUrl: './profesionales-editar.html',
})
export class ProfesionalesEditar implements OnInit {
  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly profesionalService = inject(ProfesionalService);

  saving = signal(false);

  profesional = signal<Profesional | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.profesionalService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.profesional.set(response.data);
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  guardar(data: ProfesionalUpdateDto): void {
    const id = this.profesional()?.id;

    if (!id) return;

    this.saving.set(true);

    this.profesionalService.actualizar(id, data).subscribe({
      next: () => {
        this.router.navigate(['/profesionales', id]);
      },

      error: (error) => {
        console.error(error);

        this.saving.set(false);
      },

      complete: () => {
        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    const id = this.profesional()?.id;

    this.router.navigate(['/profesionales', id]);
  }
}
