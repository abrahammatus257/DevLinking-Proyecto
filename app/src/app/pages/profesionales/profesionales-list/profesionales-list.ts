import { Component, OnInit, inject, signal, computed } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Profesional } from '../../../core/models/profesional.model';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profesionales-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profesionales-list.html',
  styleUrl: './profesionales-list.css',
})
export class ProfesionalesList implements OnInit {
  private readonly profesionalService = inject(ProfesionalService);

  profesionales = signal<Profesional[]>([]);

  search = signal('');

  modalidadSeleccionada = signal('');

  disponibilidadSeleccionada = signal('');

  ngOnInit(): void {
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    this.profesionalService.listar().subscribe({
      next: (response) => {
        console.log('Profesionales:', response.data);

        this.profesionales.set(response.data);
      },

      error: (error) => {
        console.error('Error cargando profesionales', error);
      },
    });
  }

  profesionalesLista = computed(() => {
    return this.profesionales().filter((profesional) => {
      const coincideNombre = profesional.usuario.nombre_completo
        .toLowerCase()
        .includes(this.search().toLowerCase());

      const coincideModalidad =
        this.modalidadSeleccionada() === '' ||
        profesional.modalidad === this.modalidadSeleccionada();

      const coincideDisponibilidad =
        this.disponibilidadSeleccionada() === '' ||
        String(profesional.disponible) === this.disponibilidadSeleccionada();

      return coincideNombre && coincideModalidad && coincideDisponibilidad;
    });
  });

  filtrarPorModalidad(modalidad: string): void {
    this.modalidadSeleccionada.set(modalidad);
  }

  filtrarPorDisponibilidad(disponibilidad: string): void {
    this.disponibilidadSeleccionada.set(disponibilidad);
  }

  getImageUrl(nombreArchivo: string): string {
    return this.profesionalService.getImageUrl(nombreArchivo);
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

      Flutter: '#02569b',

      Docker: '#2496ed',

      Figma: '#a259ff',
    };

    return colores[tecnologia] ?? '#64748b';
  }

  private readonly router = inject(Router);

  verDetalle(id: number): void {
    this.router.navigate(['/profesionales', id]);
  }

  crearProfesional(): void {

    this.router.navigate([
      '/profesionales/crear'
    ]);

  }
}
