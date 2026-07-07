import {
  Component,
  signal,
  computed,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Usuario,
  Estado
} from '../../../core/models/usuario.model';

import { UsuarioService }
  from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css'
})
export class UsuariosList
  implements OnInit {

  private readonly usuarioService =
    inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);

  search = signal('');

  rolSeleccionado = signal('');

  ngOnInit(): void {

    console.log('Cargando usuarios...');
    this.cargarUsuarios();

  }

  cargarUsuarios(): void {

    this.usuarioService
      .listar()
      .subscribe({


        next: (response) => {
          
          console.log('RESPONSE', response);
          console.log('DATA', response.data);

          this.usuarios.set(
            response.data
          );

        },


        error: (error) => {

          console.error(
            'Error cargando usuarios',
            error
          );

        }

      });

  }

  usuariosFiltrados = computed(() => {

    return this.usuarios().filter(usuario => {

      const coincideTexto =

        usuario.nombre_completo
          .toLowerCase()
          .includes(
            this.search()
              .toLowerCase()
          )

        ||

        usuario.correo
          .toLowerCase()
          .includes(
            this.search()
              .toLowerCase()
          );

      const coincideRol =

        this.rolSeleccionado() === ''

        ||

        usuario.rol ===
        this.rolSeleccionado();

      return coincideTexto
        && coincideRol;

    });

  });

  cambiarEstado(id: number) {

    const nuevosUsuarios =

      this.usuarios().map(u => {

        if (u.id === id) {

          const nuevoEstado: Estado =

            u.estado === 'ACTIVO'
              ? 'INACTIVO'
              : 'ACTIVO';

          return {

            ...u,

            estado: nuevoEstado

          };

        }

        return u;

      });

    this.usuarios.set(
      nuevosUsuarios
    );

  }

}