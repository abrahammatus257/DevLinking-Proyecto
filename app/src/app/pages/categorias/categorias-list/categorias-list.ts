import { Component, signal, computed, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

import { Categoria } from '../../../core/models/categoria.model';

import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias-list.html',
  styleUrl: './categorias-list.css',
})
export class CategoriasList implements OnInit {
  private readonly categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);

  search = signal('');

  estadoSeleccionado = signal('');

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (response) => {
        this.categorias.set(response.data);
      },

      error: (error) => {
        console.error('Error cargando categorías', error);
      },
    });
  }

  categoriasLista = computed(() => {
    return this.categorias().filter((categoria) => {
      const coincideTexto = categoria.nombre.toLowerCase().includes(this.search().toLowerCase()) || categoria.descripcion?.toLowerCase().includes(this.search().toLowerCase());
      
      const coincideEstado = this.estadoSeleccionado() === '' || categoria.estado === this.estadoSeleccionado();

      return coincideTexto && coincideEstado;
    });
  });

  filtrarPorEstado(estado: string): void {
    this.estadoSeleccionado.set(estado);
  }

  confirmarCambioEstado(id: number): void {
    Swal.fire({
      title: 'Cambiar estado',

      text: '¿Seguro que desea cambiar el estado de esta categoría?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Aceptar',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#2563eb',

      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.cambiarEstado(id).subscribe({
          next: () => {
            this.cargarCategorias();

            Swal.fire({
              title: 'Actualizado',

              text: 'Estado actualizado correctamente',

              icon: 'success',

              timer: 1500,

              showConfirmButton: false,
            });
          },

          error: () => {
            Swal.fire({
              title: 'Error',

              text: 'No se pudo cambiar el estado',

              icon: 'error',
            });
          },
        });
      }
    });
  }
}
