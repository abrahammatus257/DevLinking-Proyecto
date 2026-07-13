import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { CitasDetalle } from '../citas-detalle/citas-detalle';

@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CitasDetalle],
  templateUrl: './citas-list.html',
  styleUrl: './citas-list.css'
})
export class CitasList implements OnInit {
  private readonly citaService = inject(CitaService);

  // Variable controladora para pasar la cita seleccionada al componente detalle
  citaSeleccionada = signal<Cita | null>(null);

  // Signals de estado
  citas = signal<Cita[]>([]);
  loading = signal<boolean>(true);

  // Signals para los Filtros Combinados
  filtroEstado = signal<string>('');
  filtroBuscar = signal<string>(''); 
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  // Lógica de filtrado reactivo combinado mediante Computed
  citasFiltradas = computed(() => {
    return this.citas().filter(cita => {
      const cumpleEstado = !this.filtroEstado() || cita.estado === this.filtroEstado();

      const busqueda = this.filtroBuscar().toLowerCase().trim();
      const cumpleBusqueda = !busqueda || 
        cita.cliente.nombre_completo.toLowerCase().includes(busqueda) ||
        (cita.profesional.usuario?.nombre_completo || '').toLowerCase().includes(busqueda) ||
        (cita.profesional.tituloProfesional || '').toLowerCase().includes(busqueda);

      let cumpleFechas = true;
      if (this.fechaInicio() || this.fechaFin()) {
        const fechaCitaMili = new Date(cita.fechaCita).setHours(0, 0, 0, 0);

        if (this.fechaInicio()) {
          const inicioMili = new Date(this.fechaInicio()).setHours(0, 0, 0, 0);
          if (fechaCitaMili < inicioMili) cumpleFechas = false;
        }
        if (this.fechaFin()) {
          const finMili = new Date(this.fechaFin()).setHours(23, 59, 59, 999);
          if (fechaCitaMili > finMili) cumpleFechas = false;
        }
      }

      return cumpleEstado && cumpleBusqueda && cumpleFechas;
    });
  });

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.loading.set(true);
    this.citaService.listar().subscribe({
      next: (res) => {
        this.citas.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar citas:', err);
        this.loading.set(false);
      }
    });
  }

  abrirModalDetalle(cita: Cita): void {
    this.citaSeleccionada.set(cita);
  }

  cerrarModalDetalle(): void {
    this.citaSeleccionada.set(null);
  }

  limpiarFiltros(): void {
    this.filtroEstado.set('');
    this.filtroBuscar.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
  }

  getBadgeClass(estado: EstadoCita): string {
    const clases: Record<EstadoCita, string> = {
      PENDIENTE: 'badge-pendiente',
      ACEPTADA: 'badge-aceptada',
      RECHAZADA: 'badge-rechazada',
      CANCELADA: 'badge-cancelada',
      COMPLETADA: 'badge-completada'
    };
    return clases[estado] || 'badge-neutral';
  }
}