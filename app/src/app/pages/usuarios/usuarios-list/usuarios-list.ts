import { Component, signal, computed, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

import { Usuario, Estado } from '../../../core/models/usuario.model';

import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);

  search = signal('');

  rolSeleccionado = signal('');

  ngOnInit(): void {
    console.log('Cargando usuarios...');
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (response) => {
        console.log('RESPONSE', response);
        console.log('DATA', response.data);

        this.usuarios.set(response.data);
      },

      error: (error) => {
        console.error('Error cargando usuarios', error);
      },
    });
  }

  usuariosLista = computed(() => {
    return this.usuarios().filter((usuario) => {
      const coincideTexto =
        usuario.nombre_completo.toLowerCase().includes(this.search().toLowerCase()) ||
        usuario.correo.toLowerCase().includes(this.search().toLowerCase());

      const coincideRol = this.rolSeleccionado() === '' || usuario.rol === this.rolSeleccionado();

      return coincideTexto && coincideRol;
    });
  });

  filtrarPorRol(rol: string): void {
    this.rolSeleccionado.set(rol);
  }

  cambiarEstado(id: number) {
    const nuevosUsuarios = this.usuarios().map((u) => {
      if (u.id === id) {
        const nuevoEstado: Estado = u.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

        return {
          ...u,

          estado: nuevoEstado,
        };
      }

      return u;
    });

    this.usuarios.set(nuevosUsuarios);
  }

  confirmarCambioEstado(id: number): void {
    Swal.fire({
      title: 'Cambiar estado',

      text: '¿Seguro que desea cambiar el estado de este usuario?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Aceptar',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#2563eb',

      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.cambiarEstado(id).subscribe({
          next: () => {
            this.cargarUsuarios();

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
