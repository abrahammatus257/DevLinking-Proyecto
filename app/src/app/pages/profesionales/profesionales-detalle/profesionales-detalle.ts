import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { Profesional } from '../../../core/models/profesional.model';

import { ProfesionalService } from '../../../core/services/profesional.service';

@Component({
  selector: 'app-profesionales-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profesionales-detalle.html',
  styleUrl: './profesionales-detalle.css',
})
export class ProfesionalesDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly profesionalService = inject(ProfesionalService);

  profesional = signal<Profesional | null>(null);

  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/profesionales']);

      return;
    }

    this.cargarProfesional(id);
  }

  cargarProfesional(id: number): void {
    this.loading.set(true);

    this.profesionalService.obtenerPorId(id).subscribe({
      next: (response) => {
        console.log('Detalle profesional', response);

        this.profesional.set(response.data);

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error cargando profesional', error);

        this.loading.set(false);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/profesionales']);
  }

  getImageUrl(fileName: string): string {
    return this.profesionalService.getImageUrl(fileName);
  }

  getTechColor(tecnologia: string): string {
    const colores: Record<string, string> = {
      Angular: '#dd0031',

      React: '#61dafb',

      '.NET / C#': '#512bd4',

      'ASP.NET Core MVC': '#7c3aed',

      'SQL Server': '#cc2927',

      Node: '#339933',

      Express: '#374151',

      MongoDB: '#13aa52',

      Java: '#f89820',

      Spring: '#6db33f',

      Docker: '#2496ed',

      Figma: '#a259ff',
    };

    return colores[tecnologia] ?? '#64748b';
  }
}
