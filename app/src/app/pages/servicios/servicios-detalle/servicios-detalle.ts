import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicio } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicios-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios-detalle.html',
  styleUrl: './servicios-detalle.css',
})
export class ServiciosDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);

  servicio = signal<Servicio | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.volver();
      return;
    }

    this.cargarServicio(id);
  }

  cargarServicio(id: number): void {
    this.loading.set(true);
    this.servicioService.obtenerPorId(id).subscribe({
      next: (response) => {
        console.log('Detalle servicio obtenido:', response);
        this.servicio.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el detalle del servicio:', error);
        this.loading.set(false);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/servicios']);
  }

  editar(): void {
    this.router.navigate(['/servicios', 'editar', this.servicio()?.id]);
  }

  getImageUrl(fileName: string): string {
    return this.servicioService.getImageUrl(fileName);
  }

  // Paleta de colores consistente para tecnologías de desarrollo
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

    return colores[tecnologia] ?? '#4b5563'; // Gris oscuro por defecto
  }
}