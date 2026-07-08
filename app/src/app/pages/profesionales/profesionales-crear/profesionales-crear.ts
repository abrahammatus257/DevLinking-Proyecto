import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';

import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';

import { ProfesionalCreateDto } from '../../../core/models/profesional.model';
import { ProfesionalUpdateDto } from '../../../core/models/profesional.model';

import { ProfesionalService } from '../../../core/services/profesional.service';

@Component({
  selector: 'app-profesionales-crear',
  standalone: true,
  imports: [ProfesionalForm],
  templateUrl: './profesionales-crear.html',
})
export class ProfesionalesCrear {
  private readonly router = inject(Router);

  private readonly profesionalService = inject(ProfesionalService);

  saving = signal(false);

  guardar(data: ProfesionalCreateDto | ProfesionalUpdateDto): void {
    this.saving.set(true);

    console.log('DTO enviado', data);

    this.profesionalService.crear(data as ProfesionalCreateDto).subscribe({
      next: () => {
        this.router.navigate(['/profesionales']);
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
    this.router.navigate(['/profesionales']);
  }
}
