import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { Especialidad } from '../../../core/models/profesional.model';

@Component({
  selector: 'app-especialidades-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades-lista.html',
  styleUrl: './especialidades-lista.css'
})
export class EspecialidadesLista implements OnInit {
  private readonly especialidadService = inject(EspecialidadService);

  // Estados reactivos mediante Signals
  especialidades = signal<Especialidad[]>([]);
  filtroNombre = signal('');
  filtroEstado = signal('TODOS');

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (response) => {
        // Al usar .set(), Angular actualiza la UI de inmediato
        this.especialidades.set(response.data);
      },
      error: (err) => console.error('Error al recuperar especialidades de DevLinking:', err)
    });
  }

  // Computed que reacciona automáticamente a cualquier cambio de los signals internos
  especialidadesFiltradas = computed(() => {
    return this.especialidades().filter(esp => {
      const coincideNombre = esp.nombre.toLowerCase().includes(this.filtroNombre().toLowerCase());
      const coincideEstado = this.filtroEstado() === 'TODOS' || esp.estado === this.filtroEstado();
      return coincideNombre && coincideEstado;
    });
  });

  confirmarCambioEstado(especialidad: Especialidad): void {
    const proximoEstado = especialidad.estado === 'ACTIVO' ? 'desactivar' : 'activar';
    
    Swal.fire({
      title: 'Cambiar estado',
      text: `¿Seguro que desea ${proximoEstado} la especialidad "${especialidad.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f59e0b', // Tu color ámbar corporativo
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.especialidadService.cambiarEstado(especialidad.id).subscribe({
          next: () => {
            this.cargarEspecialidades(); // Recarga limpia que disparará el cambio visual al instante

            Swal.fire({
              title: 'Actualizado',
              text: 'Estado actualizado correctamente',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            console.error('Error al actualizar estado:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo cambiar el estado',
              icon: 'error',
            });
          }
        });
      }
    });
  }
}